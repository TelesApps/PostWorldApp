import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { GameWorld } from '../interfaces/game-world.interface';
import { lastValueFrom } from 'rxjs';
import { Continent } from '../interfaces/continents.interface';
import { Region, RegionPlayerActivity } from '../interfaces/regions.interface';
import { Building, Colonist } from '../interfaces/colony.interface';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private afs: AngularFirestore) { }

  getSavedGames(playerId: string) {
    // Get all gameWorlds that have been created by the player
    return lastValueFrom(this.afs.collection('game_worlds', ref => ref.where('created_player_id', '==', playerId)).get())
      .then((snapshot) => {
        const gameWorlds = snapshot.docs.map(doc => doc.data() as GameWorld);
        return gameWorlds;
      });
  }

  loadGame(gameWorldId: string): Promise<GameWorld> {
    const gameWorldRef = this.afs.collection('game_worlds').doc(gameWorldId).ref;

    return gameWorldRef.get()
      .then(docSnap => {
        if (!docSnap.exists) {
          throw new Error("GameWorld not found!");
        }
        const gameWorld = docSnap.data() as GameWorld;

        return Promise.all([
          // Fetch all related continents
          this.afs.collection('continents', ref => ref.where('world_id', '==', gameWorldId)).get().toPromise(),
          // Fetch all related regions
          this.afs.collection('regions', ref => ref.where('world_id', '==', gameWorldId)).get().toPromise(),
          // Fetch all related player activities
          this.afs.collection('player_activities', ref => ref.where('world_id', '==', gameWorldId)).get().toPromise(),
          // Fetch all related buildings
          this.afs.collection('buildings', ref => ref.where('world_id', '==', gameWorldId)).get().toPromise(),
          // Fetch all related colonists
          this.afs.collection('colonists', ref => ref.where('world_id', '==', gameWorldId)).get().toPromise()
        ])
          .then(([continentsSnap, regionsSnap, activitiesSnap, buildingsSnap, colonistsSnap]) => {
            const continents = continentsSnap.docs.map(doc => doc.data() as Continent);
            const regions = regionsSnap.docs.map(doc => doc.data() as Region);
            const activities = activitiesSnap.docs.map(doc => doc.data() as RegionPlayerActivity);
            const buildings = buildingsSnap.docs.map(doc => doc.data() as Building);
            const colonists = colonistsSnap.docs.map(doc => doc.data() as Colonist);

            // Stitch together the data
            gameWorld.continents = continents;
            gameWorld.total_terrain_types = new Map(Object.entries(gameWorld.total_terrain_types_json));

            continents.forEach(continent => {
              continent.regions = regions.filter(region => region.continent_id === continent.id);
            });

            regions.forEach(region => {
              region.player_activity = activities.filter(activity => activity.region_id === region.id);
            });

            activities.forEach(activity => {
              activity.colony.buildings = buildings.filter(building => building.region_id === activity.region_id);
            });

            buildings.forEach(building => {
              building.assigned_colonists = colonists.filter(colonist => colonist.region_id === building.region_id);
            });

            return gameWorld;
          });
      })
      .catch(error => {
        console.error("Error loading game: ", error);
        throw error; // Propagate the error so it can be handled outside if needed
      });
  }

  saveGame(gameWorld: GameWorld) {
    // Separate all children of gameWorld into their own collections
    const allContinents = gameWorld.continents || [];
    const allRegions = allContinents.map(continent => continent.regions).flat();
    const regionPlayerActivity = allRegions.map(region => region.player_activity).flat();
    const buildings = regionPlayerActivity.map(activity => activity.colony.buildings).flat();
    const colonists = buildings.map(building => building.assigned_colonists).flat();
    // Remove all children objects to store only ids
    gameWorld.total_terrain_types_json = Object.fromEntries(gameWorld.total_terrain_types);
    delete gameWorld.total_terrain_types;
    gameWorld.continents = [];
    allContinents.forEach(continent => {
      delete continent.regions;
    });
    allRegions.forEach(region => {
      delete region.player_activity;
    });
    regionPlayerActivity.forEach(activity => {
      delete activity.colony.colonists;
    });
    // Create a batch to ensure atomic writes
    const batch = this.afs.firestore.batch();
    // Save the gameWorld
    const gameWorldRef = this.afs.collection('game_worlds').doc(gameWorld.id).ref;
    batch.set(gameWorldRef, gameWorld);
    // Save all continents
    allContinents.forEach(continent => {
      const continentRef = this.afs.collection('continents').doc(continent.id).ref;
      batch.set(continentRef, continent);
    });
    // Save all regions
    allRegions.forEach(region => {
      const regionRef = this.afs.collection('regions').doc(region.id).ref;
      batch.set(regionRef, region);
    });
    // Save all player activities
    regionPlayerActivity.forEach(activity => {
      const activityRef = this.afs.collection('player_activities').doc(activity.id).ref;
      batch.set(activityRef, activity);
    });
    // Save all buildings
    buildings.forEach(building => {
      const buildingRef = this.afs.collection('buildings').doc(building.id).ref;
      batch.set(buildingRef, building);
    });
    // Save all colonists
    colonists.forEach(colonist => {
      const colonistRef = this.afs.collection('colonists').doc(colonist.id).ref;
      batch.set(colonistRef, colonist);
    });
    // Commit the batch
    return batch.commit()
      .then(() => {
        console.log("All data saved successfully!");
      })
      .catch((error: any) => {
        console.error("Error saving data: ", error);
      });
  }

  async deleteGame(gameWorldId: string) {
    let batch = this.afs.firestore.batch();
    let operationsCount = 0;

    // Helper function to commit and reset the batch if needed
    const checkAndCommitBatch = async () => {
      if (operationsCount >= 500) {
        await batch.commit();
        operationsCount = 0;
        batch = this.afs.firestore.batch();
      }
    };

    // Delete the gameWorld itself
    const gameWorldRef = this.afs.collection('game_worlds').doc(gameWorldId).ref;
    batch.delete(gameWorldRef);
    operationsCount++;

    await checkAndCommitBatch();

    // Array of collections to be checked and deleted
    const collections = ['continents', 'regions', 'player_activities', 'buildings', 'colonists'];

    for (const collection of collections) {
      const snapshot = await lastValueFrom(this.afs.collection(collection, ref => ref.where('world_id', '==', gameWorldId)).get());

      for (const doc of snapshot.docs) {
        batch.delete(doc.ref);
        operationsCount++;

        await checkAndCommitBatch();
      }
    }

    // Commit any remaining operations in the batch
    if (operationsCount > 0) {
      try {
        await batch.commit();
        console.log("All data deleted successfully!");
      } catch (error) {
        console.error("Error deleting data: ", error);
      }
    }
  }
}
