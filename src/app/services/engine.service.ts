import { Injectable } from '@angular/core';
import { GameWorld } from '../interfaces/game-world.interface';
import { BehaviorSubject } from 'rxjs';
import { Region } from '../interfaces/regions.interface';

@Injectable({
  providedIn: 'root'
})
export class EngineService {

  private worker: Worker;
  private gameSpeedMultiplier: number = 1; // Default to normal speed

  gameWorld: BehaviorSubject<GameWorld> = new BehaviorSubject<GameWorld>(null);
  allRegions: BehaviorSubject<Region[]> = new BehaviorSubject<Region[]>(null);

  constructor() {

  }

  public startEngine(gameWorld: GameWorld): void {
    this.gameWorld.next(gameWorld);
    // extract all regions from the game world
    let regions: Region[] = [];
    gameWorld.continents.forEach(continent => {
      continent.regions.forEach(region => {
        regions.push(region);
      });
    });
    this.allRegions.next(regions);
    // initialize the worker if it hasn't been already
    if (!this.worker)
      this.initializeWorker();
  }

  private initializeWorker(): void {
    console.log('Initializing worker');
    this.worker = new Worker(new URL('../workers/game-engine.worker.ts', import.meta.url), { type: 'module' });
    this.worker.onmessage = (event) => {
      // Handle messages from worker. This might be updates to the GameWorld, for instance.
      switch (event.data.type) {
        case 'UPDATE_GAME_WORLD':
          this.gameWorld = event.data.payload;
          break;
        // You can handle more types of messages here
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