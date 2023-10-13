import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { GameWorld } from '../interfaces/game-world.interface';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private afs: AngularFirestore) { }

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
      const activityRef = this.afs.collection('player_activities').doc(activity.civilization_id).ref;
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
}
