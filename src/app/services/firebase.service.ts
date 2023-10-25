import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { GameWorld } from '../interfaces/game-world.interface';
import { lastValueFrom } from 'rxjs';
import { Continent } from '../interfaces/continents.interface';
import { Party, Region } from '../interfaces/regions.interface';
import { Building } from '../interfaces/colony.interface';
import { Colonist } from '../interfaces/colonist.interface';
import { RegionPlayerActivity } from '../interfaces/player_activity.interface';
import { Civilization } from '../interfaces/civilization.interface';

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

  saveCivilization(civilization: Civilization) {
    // Delete Continents.Region objects and only save the Ids
    civilization.discovered_continents.forEach(continent => {
      delete continent.regions;
    });
    // Delete RegionPlayerActivity from Regions and only save the Ids
    civilization.discovered_regions.forEach(region => {
      delete region.players_activity;
    });
    const civilizationRef = this.afs.collection('civilizations').doc(civilization.id).ref;
    return civilizationRef.set(civilization, { merge: true });
  }

  deleteCivilization(civilizationId: string) {
    const civilizationRef = this.afs.collection('civilizations').doc(civilizationId).ref;
    return civilizationRef.delete();
  }

  getCivilizationWithId(civId: string) {
    return lastValueFrom(this.afs.collection('civilizations').doc(civId).get())
      .then((snapshot) => {
        const civilization = snapshot.data() as Civilization;
        return civilization;
      });
  }

  getAllCivilizations(gameWorldId: string): Promise<Civilization[]> {
    return lastValueFrom(this.afs.collection('civilizations', ref => ref.where('world_id', '==', gameWorldId)).get())
      .then((snapshot) => {
        const civilizations = snapshot.docs.map(doc => doc.data() as Civilization);
        return civilizations;
      });
  }

  public getPlayerCivilization(world_id: string, player_id: string): Promise<Civilization> {
    return lastValueFrom(this.afs.collection('civilizations', ref => ref.where('world_id', '==', world_id).where('player_id', '==', player_id)).get())
      .then((snapshot) => {
        const civilizations = snapshot.docs.map(doc => doc.data() as Civilization);
        return civilizations[0];
      }).catch(err => {
        throw err;
      });
  }

  public getAllColonists(gameWorldId: string): Promise<Colonist[]> {
    return lastValueFrom(this.afs.collection('colonists', ref => ref.where('world_id', '==', gameWorldId)).get())
      .then((snapshot) => {
        const colonists = snapshot.docs.map(doc => doc.data() as Colonist);
        return colonists;
      });
  }

  public getAllParties(gameWorldId: string): Promise<Party[]> {
    return lastValueFrom(this.afs.collection('parties', ref => ref.where('world_id', '==', gameWorldId)).get())
      .then((snapshot) => {
        const parties = snapshot.docs.map(doc => doc.data() as Party);
        return parties;
      });
  }

  public getAllBuildings(gameWorldId: string): Promise<Building[]> {
    return lastValueFrom(this.afs.collection('buildings', ref => ref.where('world_id', '==', gameWorldId)).get())
      .then((snapshot) => {
        const buildings = snapshot.docs.map(doc => doc.data() as Building);
        return buildings;
      });
  }

  public getAllRegions(gameWorldId: string): Promise<Region[]> {
    return lastValueFrom(this.afs.collection('regions', ref => ref.where('world_id', '==', gameWorldId)).get())
      .then((snapshot) => {
        const regions = snapshot.docs.map(doc => doc.data() as Region);
        return regions;
      });
  }

  public getAllContinents(gameWorldId: string): Promise<Continent[]> {
    return lastValueFrom(this.afs.collection('continents', ref => ref.where('world_id', '==', gameWorldId)).get())
      .then((snapshot) => {
        const continents = snapshot.docs.map(doc => doc.data() as Continent);
        return continents;
      });
  }

  public async getAllPlayerActivity(gameWorldId: string): Promise<RegionPlayerActivity[]> {
    try {
      const [activitiesSnap, partiesSnap, colonistsSnap] = await Promise.all([
        lastValueFrom(this.afs.collection('players_activity', ref => ref.where('world_id', '==', gameWorldId)).get()),
        lastValueFrom(this.afs.collection('parties', ref => ref.where('world_id', '==', gameWorldId)).get()),
        lastValueFrom(this.afs.collection('colonists', ref => ref.where('world_id', '==', gameWorldId)).get())
      ]);

      const activities = activitiesSnap.docs.map(doc => doc.data() as RegionPlayerActivity);
      const parties = partiesSnap.docs.map(doc => doc.data() as Party);
      const colonists = colonistsSnap.docs.map(doc => doc.data() as Colonist);

      activities.forEach(activity => {
        // Assign parties to activities
        if (activity.party_ids) {
          activity.parties = parties.filter(party => activity.party_ids.includes(party.id));

          // For each party, assign the corresponding colonists
          activity.parties.forEach(party => {
            party.colonists = colonists.filter(colonist => party.colonist_ids.includes(colonist.id));
          });
        }

        // Assign colonists to colonies if the activity has a colony
        if (activity.colony) {
          activity.colony.colonists = colonists.filter(colonist => !colonist.assigned_party_id);
        }
      });

      return activities;
    } catch (error) {
      console.error("Error fetching player activity: ", error);
      throw error;
    }
  }

  public getAllPlayerActivityForRegion(gameWorldId: string, regionId: string): Promise<RegionPlayerActivity[]> {
    return lastValueFrom(this.afs.collection('players_activity', ref => ref.where('world_id', '==', gameWorldId)
      .where('region_id', '==', regionId)).get()).then((snapshot) => {
        const playerActivity = snapshot.docs.map(doc => doc.data() as RegionPlayerActivity);
        return playerActivity;
      });
  }

  public getPlayersActivitiesWithIds(ids: string[]): Promise<RegionPlayerActivity[]> {
    return lastValueFrom(this.afs.collection('players_activity', ref => ref.where('id', 'in', ids)).get())
      .then((snapshot) => {
        const playerActivity = snapshot.docs.map(doc => doc.data() as RegionPlayerActivity);
        return playerActivity;
      });
  }

  // *************************** SAVE AND LOAD GAME BELLOW ***************************

  saveGame(gameWorld: GameWorld) {
    // Separate all children of gameWorld into their own collections
    const allContinents = gameWorld.continents || [];
    const allRegions = allContinents.map(continent => continent.regions).flat();
    const regionPlayerActivity = allRegions.map(region => region.players_activity).flat();
    const allColonists = regionPlayerActivity.map(activity => activity.colony.colonists).flat();
    // Extract parties and remove the actual objects, retaining only IDs
    const allParties: Party[] = [];
    regionPlayerActivity.forEach(activity => {
      if (activity.parties) {
        allParties.push(...activity.parties);
        allColonists.push(...activity.parties.map(p => p.colonists).flat());
        activity.party_ids = activity.parties.map(p => p.id);
        delete activity.parties;
      }
    });
    const buildings = regionPlayerActivity.map(activity => activity.colony.buildings).flat();
    // Remove all children objects to store only ids
    gameWorld.total_terrain_types_json = Object.fromEntries(gameWorld.total_terrain_types);
    delete gameWorld.total_terrain_types;
    gameWorld.continents = [];
    allContinents.forEach(continent => {
      delete continent.regions;
    });
    allRegions.forEach(region => {
      delete region.players_activity;
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
      const activityRef = this.afs.collection('players_activity').doc(activity.id).ref;
      batch.set(activityRef, activity);
    });
    // Save all parties
    allParties.forEach(party => {
      const partyRef = this.afs.collection('parties').doc(party.id).ref;
      batch.set(partyRef, party);
    });
    // Save all buildings
    buildings.forEach(building => {
      const buildingRef = this.afs.collection('buildings').doc(building.id).ref;
      batch.set(buildingRef, building);
    });
    // Save all colonists
    allColonists.forEach(colonist => {
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
    const collections = ['continents', 'regions', 'players_activity', 'buildings', 'colonists', 'parties'];

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

  loadGame(gameWorldId: string): Promise<GameWorld> {
    const gameWorldRef = this.afs.collection('game_worlds').doc(gameWorldId).ref;

    return gameWorldRef.get()
      .then(docSnap => {
        if (!docSnap.exists) {
          throw new Error("GameWorld not found!");
        }
        const gameWorld = docSnap.data() as GameWorld;

        return Promise.all([
          // Switch all of these .toPromise() to lastValueFrom()
          // Fetch all related continents
          lastValueFrom(this.afs.collection('continents', ref => ref.where('world_id', '==', gameWorldId)).get()),
          // Fetch all related regions
          lastValueFrom(this.afs.collection('regions', ref => ref.where('world_id', '==', gameWorldId)).get()),
          // Fetch all related player activities
          lastValueFrom(this.afs.collection('players_activity', ref => ref.where('world_id', '==', gameWorldId)).get()),
          // Fetch all related parties
          lastValueFrom(this.afs.collection('parties', ref => ref.where('world_id', '==', gameWorldId)).get()),
          // Fetch all related buildings
          lastValueFrom(this.afs.collection('buildings', ref => ref.where('world_id', '==', gameWorldId)).get()),
          // Fetch all related colonists
          lastValueFrom(this.afs.collection('colonists', ref => ref.where('world_id', '==', gameWorldId)).get())
        ])
          .then(([continentsSnap, regionsSnap, activitiesSnap, partiesSnap, buildingsSnap, colonistsSnap]) => {
            const continents = continentsSnap.docs.map(doc => doc.data() as Continent);
            const regions = regionsSnap.docs.map(doc => doc.data() as Region);
            const activities = activitiesSnap.docs.map(doc => doc.data() as RegionPlayerActivity);
            const parties = partiesSnap.docs.map(doc => doc.data() as Party);
            const buildings = buildingsSnap.docs.map(doc => doc.data() as Building);
            const colonists = colonistsSnap.docs.map(doc => doc.data() as Colonist);

            // Stitch together the data
            gameWorld.continents = continents;
            gameWorld.total_terrain_types = new Map(Object.entries(gameWorld.total_terrain_types_json));

            continents.forEach(continent => {
              continent.regions = regions.filter(region => region.continent_id === continent.id);
            });

            regions.forEach(region => {
              region.players_activity = activities.filter(activity => activity.region_id === region.id);
            });

            activities.forEach(activity => {
              activity.colony.buildings = buildings.filter(building => building.region_id === activity.region_id);
              activity.parties = parties.filter(party => activity.party_ids.includes(party.id));
            });

            parties.forEach(party => {
              party.colonists = colonists.filter(colonist => colonist.region_id === party.current_region_id);
              party.colonist_ids = party.colonists.map(colonist => colonist.id);
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


}
