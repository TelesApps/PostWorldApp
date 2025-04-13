import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { GameWorld } from '../interfaces/game-world.interface';
import { Civilization } from '../interfaces/civilization.interface';
import { Continent } from '../interfaces/continents.interface';
import { Region } from '../interfaces/regions.interface';
import { RegionPlayerActivity } from '../interfaces/player_activity.interface';
import { Building } from '../interfaces/colony.interface';

@Injectable({
  providedIn: 'root'
})
export class DevEngineService {

    // the Dec engine will replace the engine for testing the game's database and some logic


    private worker: Worker;
    private gameSpeedMultiplier: number = .25; // Default to normal speed
  
    private gameWorld: ReplaySubject<GameWorld> = new ReplaySubject<GameWorld>(1);
    private civilization: ReplaySubject<Civilization> = new ReplaySubject<Civilization>(1);
    private allContinents: ReplaySubject<Continent[]> = new ReplaySubject<Continent[]>(1);
    private allRegions: ReplaySubject<Region[]> = new ReplaySubject<Region[]>(1);
    // allParties: ReplaySubject<Party[]> = new ReplaySubject<Party[]>(1);
    private allPlayerActivity: ReplaySubject<RegionPlayerActivity[]> = new ReplaySubject<RegionPlayerActivity[]>(1);
    private allBuildings: ReplaySubject<Building[]> = new ReplaySubject<Building[]>(1);

  constructor() { }
}
