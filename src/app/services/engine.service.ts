import { Injectable } from '@angular/core';
import { GameWorld } from '../interfaces/game-world.interface';

@Injectable({
  providedIn: 'root'
})
export class EngineService {

  gameWorld: GameWorld;

  constructor() { }
}
