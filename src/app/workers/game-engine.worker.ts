/// <reference lib="webworker" />

import { Civilization } from "../interfaces/civilization.interface";
import { Colonist } from "../interfaces/colonist.interface";
import { Building } from "../interfaces/colony.interface";
import { Continent } from "../interfaces/continents.interface";
import { GameWorld } from "../interfaces/game-world.interface";
import { RegionPlayerActivity } from "../interfaces/player_activity.interface";
import { Party, Region } from "../interfaces/regions.interface";
import { ColonistActions } from "./colonist.functions";

let gameSpeedMultiplier: number = 1;

let everySecondInterval: number;
let everyThirtySecondsInterval: number;
let everyNinetyInterval: number;

let gameWorld: GameWorld;
let playerCivilization: Civilization;
let allContinents: Continent[];
let allRegions: Region[];
// let allParties: Party[];
let allPlayerActivity: RegionPlayerActivity[];
let allBuildings: Building[];
// let allColonists: Colonist[];

function setIntervals(): void {
  clearInterval(everySecondInterval);
  clearInterval(everyThirtySecondsInterval);
  clearInterval(everyNinetyInterval);

  everySecondInterval = <number><any>setInterval(() => {
    // Every-second tasks
    //// PlayerActivity
    allPlayerActivity.forEach(activity => {
      const partyColonists = activity.parties.map(party => party.colonists).flat();
      const colonists = activity.colony.colonists;
      partyColonists.forEach(colonist => { ColonistActions.updateColonistPerSecond(colonist); });
      colonists.forEach(colonist => { ColonistActions.updateColonistPerSecond(colonist, activity.colony); });
    });
    //// Update other things
    postMessage({
      type: 'UPDATED_GAME_WORLD', payload: {
        gameWorld, playerCivilization, allContinents, allRegions, allPlayerActivity, allBuildings
      }
    });
  }, 1000 / gameSpeedMultiplier);

  everyThirtySecondsInterval = <number><any>setInterval(() => {
    // Every-30-second tasks
  }, 30000 / gameSpeedMultiplier);

  everyNinetyInterval = <number><any>setInterval(() => {
    // Every-minute tasks
  }, 90000 / gameSpeedMultiplier);
}

// Initial setting of intervals.
setIntervals();

self.onmessage = (event: MessageEvent) => {
  switch (event.data.type) {
    case 'INIT_WORLD':
      // Initialize the game world
      gameWorld = event.data.payload.gameWorld;
      playerCivilization = event.data.payload.playerCivilization;
      allContinents = event.data.payload.allContinents;
      allRegions = event.data.payload.allRegions;
      // allParties = event.data.payload.allParties;
      allPlayerActivity = event.data.payload.allPlayerActivity;
      allBuildings = event.data.payload.allBuildings;
      break;
    case 'SET_SPEED':
      gameSpeedMultiplier = event.data.multiplier;
      setIntervals();
      break;
    case 'UPDATE_STATE':
      // Handle state updates sent from the main thread
      break;
    // Handle other types of messages here
  }
};