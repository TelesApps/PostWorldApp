import { Injectable } from '@angular/core';
import { GameWorld } from '../interfaces/game-world.interface';
import { BehaviorSubject } from 'rxjs';
import { Party, Region } from '../interfaces/regions.interface';
import { Continent } from '../interfaces/continents.interface';
import { Building } from '../interfaces/colony.interface';
import { Colonist } from '../interfaces/colonist.interface';
import { RegionPlayerActivity } from '../interfaces/player_activity.interface';
import { Civilization } from '../interfaces/civilization.interface';

@Injectable({
  providedIn: 'root'
})
export class EngineService {

  private worker: Worker;
  private gameSpeedMultiplier: number = .25; // Default to normal speed

  gameWorld: BehaviorSubject<GameWorld> = new BehaviorSubject<GameWorld>(null);
  civilization: BehaviorSubject<Civilization> = new BehaviorSubject<Civilization>(null);
  allContinents: BehaviorSubject<Continent[]> = new BehaviorSubject<Continent[]>(null);
  allRegions: BehaviorSubject<Region[]> = new BehaviorSubject<Region[]>(null);
  // allParties: BehaviorSubject<Party[]> = new BehaviorSubject<Party[]>(null);
  allPlayerActivity: BehaviorSubject<RegionPlayerActivity[]> = new BehaviorSubject<RegionPlayerActivity[]>(null);
  allBuildings: BehaviorSubject<Building[]> = new BehaviorSubject<Building[]>(null);

  constructor() {

  }

  public startEngine(gameWorld: GameWorld, playerCivilization: Civilization, allContinents: Continent[], allRegions: Region[], allParties: Party[],
    allPlayerActivity: RegionPlayerActivity[], allBuildings: Building[], allColonists: Colonist[]): void {
    // initialize the worker if it hasn't been already
    if (!this.worker)
      this.initializeWorker();
    this.worker.postMessage({
      type: 'INIT_WORLD', payload: {
        gameWorld, playerCivilization, allContinents, allRegions, allParties, allPlayerActivity, allBuildings
      }
    });
  }

  private initializeWorker(): void {
    this.worker = new Worker(new URL('../workers/game-engine.worker.ts', import.meta.url), { type: 'module' });
    this.worker.onmessage = (event) => {
      if (event.data.type && event.data.payload) {
        // Handle messages from worker. This might be updates to the GameWorld, for instance.
        switch (event.data.type) {
          case 'UPDATED_GAME_WORLD':
            if (event.data.payload.gameWorld)
              this.gameWorld.next(event.data.payload.gameWorld);
            this.civilization.next(event.data.payload.playerCivilization);
            this.allContinents.next(event.data.payload.allContinents);
            this.allRegions.next(event.data.payload.allRegions);
            // this.allParties.next(event.data.payload.allParties);
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

  private adjustGameSpeed(multiplier: number): void {
    this.gameSpeedMultiplier = multiplier;
    this.worker.postMessage({ type: 'SET_SPEED', multiplier: this.gameSpeedMultiplier });
  }

  // Let's also add a method to send data to the worker, for instance to update the state based on UI interactions
  private sendUpdateToWorker(payload: any): void {
    this.worker.postMessage({ type: 'UPDATE_STATE', payload });
  }

  // And potentially a method to terminate the worker if needed, e.g., if the game ends
  public stopEngine(): void {
    if (this.worker)
      this.worker.terminate();
  }
}