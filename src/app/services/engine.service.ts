import { Injectable } from '@angular/core';
import { GameWorld } from '../interfaces/game-world.interface';
import { BehaviorSubject } from 'rxjs';
import { Party, Region, RegionPlayerActivity } from '../interfaces/regions.interface';
import { Continent } from '../interfaces/continents.interface';
import { Building } from '../interfaces/colony.interface';
import { Colonist } from '../interfaces/colonist.interface';

@Injectable({
  providedIn: 'root'
})
export class EngineService {

  private worker: Worker;
  private gameSpeedMultiplier: number = 1; // Default to normal speed

  gameWorld: BehaviorSubject<GameWorld> = new BehaviorSubject<GameWorld>(null);
  allContinents: BehaviorSubject<Continent[]> = new BehaviorSubject<Continent[]>(null);
  allRegions: BehaviorSubject<Region[]> = new BehaviorSubject<Region[]>(null);
  // allParties: BehaviorSubject<Party[]> = new BehaviorSubject<Party[]>(null);
  allPlayerActivity: BehaviorSubject<RegionPlayerActivity[]> = new BehaviorSubject<RegionPlayerActivity[]>(null);
  allBuildings: BehaviorSubject<Building[]> = new BehaviorSubject<Building[]>(null);

  constructor() {

  }

  public startEngine(gameWorld: GameWorld, allContinents: Continent[], allRegions: Region[], allParties: Party[],
    allPlayerActivity: RegionPlayerActivity[], allBuildings: Building[], allColonists: Colonist[]): void {
    // initialize the worker if it hasn't been already
    if (!this.worker)
      this.initializeWorker();
    this.worker.postMessage({
      type: 'INIT_WORLD', payload: {
        gameWorld, allContinents, allRegions, allParties, allPlayerActivity, allBuildings
      }
    });
  }

  private initializeWorker(): void {
    console.log('Initializing worker');
    this.worker = new Worker(new URL('../workers/game-engine.worker.ts', import.meta.url), { type: 'module' });
    this.worker.onmessage = (event) => {
      if (event.data.type && event.data.payload) {
        // Handle messages from worker. This might be updates to the GameWorld, for instance.
        switch (event.data.type) {
          case 'UPDATED_GAME_WORLD':
            if (event.data.payload.gameWorld)
              this.gameWorld.next(event.data.payload.gameWorld);
            this.allContinents.next(event.data.payload.allContinents);
            this.allRegions.next(event.data.payload.allRegions);
            // this.allParties.next(event.data.payload.allParties);
            console.log('allPlayerActivity', event.data.payload.allPlayerActivity);
            this.allPlayerActivity.next(event.data.payload.allPlayerActivity);
            this.allBuildings.next(event.data.payload.allBuildings);
            break;
          // You can handle more types of messages here
        }
      }
    };
    // This will set the initial intervals in the worker based on the default multiplier
    this.adjustGameSpeed(this.gameSpeedMultiplier);
  }

  adjustGameSpeed(multiplier: number): void {
    this.gameSpeedMultiplier = multiplier;
    this.worker.postMessage({ type: 'SET_SPEED', multiplier: this.gameSpeedMultiplier });
  }

  // Let's also add a method to send data to the worker, for instance to update the state based on UI interactions
  sendUpdateToWorker(payload: any): void {
    this.worker.postMessage({ type: 'UPDATE_STATE', payload });
  }

  // And potentially a method to terminate the worker if needed, e.g., if the game ends
  terminateWorker(): void {
    this.worker.terminate();
  }
}