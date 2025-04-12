import { Injectable } from '@angular/core';
import { GameWorld, createWorldObj, TerrainType } from '../interfaces/game-world.interface';
import { AirtableService } from './airtable.service';
import { map, take } from 'rxjs';
import { LibraryDataService } from './library-data.service';
import { Region, createRegionObj } from '../interfaces/regions.interface';
import { Party, createPartyObj } from '../interfaces/party.interface';
import { Continent, createContinentsObj } from '../interfaces/continents.interface';
import { v4 as uuidv4 } from 'uuid';
import { FirebaseService } from './firebase.service';
import { Player } from '../interfaces/player.interface';
import { Colonist, createColonistObj } from '../interfaces/colonist.interface';
import { RegionPlayerActivity, createRegionPlayerActivityObj } from '../interfaces/player_activity.interface';
import { Civilization, createCivilizationObj } from '../interfaces/civilization.interface';

@Injectable({
  providedIn: 'root'
})
export class GameCreationService {

  // Number of regions for each size of map
  readonly tinySize: number = 50;
  readonly smallSize: number = 80;
  readonly mediumSize: number = 110;
  readonly largeSize: number = 130;
  readonly hugeSize: number = 160;
  // Continents numbers by map size
  readonly tinyContinentLow: number = 2;
  readonly tinyContinentHigh: number = 3;
  readonly smallContinentLow: number = 2;
  readonly smallContinentHigh: number = 4;
  readonly mediumContinentLow: number = 2;
  readonly mediumContinentHigh: number = 5;
  readonly largeContinentLow: number = 3;
  readonly largeContinentHigh: number = 6;
  readonly hugeContinentLow: number = 4;
  readonly hugeContinentHigh: number = 8;
  // Archipelago numbers by map size
  readonly tinyArchipelagoLow: number = 3;
  readonly tinyArchipelagoHigh: number = 4;
  readonly smallArchipelagoLow: number = 4;
  readonly smallArchipelagoHigh: number = 6;
  readonly mediumArchipelagoLow: number = 5;
  readonly mediumArchipelagoHigh: number = 8;
  readonly largeArchipelagoLow: number = 6;
  readonly largeArchipelagoHigh: number = 9;
  readonly hugeArchipelagoLow: number = 6;
  readonly hugeArchipelagoHigh: number = 10;

  // Percentage of world is covered by water the rest is land
  readonly sealLvlLow: number = 0.6;
  readonly sealLvlMedium: number = .71;
  readonly sealLvlHigh: number = .8;
  // Percentage of land that is on a coast
  readonly pangaeaMapLow: number = 0.40;
  readonly pangaeaMapHigh: number = 0.55;
  readonly continentsMapLow: number = 0.60;
  readonly continentsMapHigh: number = 0.75;
  readonly archipelagoMapLow: number = 0.80;
  readonly archipelagoMapHigh: number = 0.92;
  // percentage of land that has access to fresh water
  readonly freshWaterSand: number = 0.1;
  readonly freshWaterArid: number = 0.2;
  readonly freshWaterAverage: number = 0.3;
  readonly freshWaterWet: number = 0.4;
  readonly freshWaterFlooded: number = 0.5;
  // multiplier for the amount of ground water in a region
  readonly baseGroundWater: number = 100;
  readonly groundWaterSand: number = 0.25;
  readonly groundWaterArid: number = 0.5;
  readonly groundWaterAverage: number = 1;
  readonly groundWaterWet: number = 1.5;
  readonly groundWaterFlooded: number = 2;
  // percentage of land that has mountains and hills
  readonly hillsLvlFlat: number = 0.14;
  readonly hillsLvlAverage: number = 0.24;
  readonly hillsLvlHills: number = 0.4;
  // percentage of land that has forests and jungles
  readonly forestryLow: number = 1;
  readonly forestryMedium: number = 2;
  readonly forestryHigh: number = 3;
  // The temperature of the world along with the rainfall determines the terrain type
  readonly temperatureFrozen: number = 1;
  readonly temperatureCold: number = 2;
  readonly temperatureTemperate: number = 3;
  readonly temperatureHot: number = 4;
  readonly temperatureScorching: number = 5;

  terrainTypeList: TerrainType[] = [];

  constructor(private airtabel: AirtableService, private supabase: LibraryDataService) { }

  createWorld(player: Player, mapSize: string, mapType: string, seaLvl: string, hillLvl: string,
    forestry: string, temperature: string, rainfall: string, gameName?: string): Promise<{ world: GameWorld, civilization: Civilization }> {
    return this.supabase.getAllTerrainTypes().then((terrains) => {
      // #TODO add additional logic to add other Players and AI here
      console.log('res from Supabase', terrains);
      // console.log(JSON.stringify(res));
      const world: GameWorld = createWorldObj();
      world.id = player.email + '_' + Date.now();
      world.created_player_id = player.player_id;
      world.game_difficulty = 'normal';
      world.game_name = gameName || player.email;
      world.map_size = mapSize;
      world.map_type = mapType;
      world.sea_lvl = seaLvl;
      world.hill_lvl = hillLvl;
      world.forestry = forestry;
      world.temperature = temperature;
      world.rainfall = rainfall;
      world.total_land = this.getMapSize(mapSize) * (1 - this.getSeaLvlValue(seaLvl));
      world.total_ocean = this.getMapSize(mapSize) * this.getSeaLvlValue(seaLvl);
      world.continents = this.createContinents(world, mapSize, mapType);
      this.createBaseRegionsWithCoasts(world);
      this.setWaterSources(world, rainfall);
      this.setTopography(world, hillLvl);
      this.setRegionTemperature(world.continents, this.getTemperatureValue(temperature));
      this.setRegionForestryLevel(world, forestry, rainfall);
      this.setRegionWaterAmount(world, forestry, rainfall);
      this.setRegionTerrainType(world, terrains);
      const civilization: Civilization = this.setPlayersStartingLocations(world);
      world.civilization_ids.push(civilization.id);
      return { world, civilization };
    }).catch((err) => {
      console.error('error from Supabase', err);
      return err;
    });

    // IF USING AIRTABLE BELLOW

    // return this.airtabel.getTerrainTypes().pipe(map((terrains: TerrainType[]) => {
    //   console.log('data from airtable', terrains)
    //   // console.log(JSON.stringify(terrains));
    //   const world: GameWorld = createWorldObj();
    //   world.id = playerId + Date.now();
    //   world.createdPlayerId = playerId;
    //   world.playerIds.push(playerId);
    //   world.gameDifficulty = 'normal';
    //   world.civilizationIds.push(playerId);

    //   world.mapSize = mapSize;
    //   world.mapType = mapType;
    //   world.seaLvl = seaLvl;
    //   world.hillLvl = hillLvl;
    //   world.forestry = forestry;
    //   world.temperature = temperature;
    //   world.rainfall = rainfall;
    //   world.totalLand = this.getMapSize(mapSize) * (1 - this.getSeaLvlValue(seaLvl));
    //   world.totalOcean = this.getMapSize(mapSize) * this.getSeaLvlValue(seaLvl);
    //   world.continents = this.createContinents(world, mapSize, mapType);
    //   this.createBaseRegionsWithCoasts(world);
    //   this.setWaterSources(world, rainfall);
    //   this.setTopography(world, hillLvl);
    //   this.setRegionTemperature(world.continents, this.getTemperatureValue(temperature));
    //   this.setRegionForestryLevel(world, forestry, rainfall);
    //   this.setRegionWaterAmount(world, forestry, rainfall);
    //   this.setRegionTerrainType(world, terrains);
    //   return world;
    // }));
  }

  private setPlayersStartingLocations(world: GameWorld, civilizationName?: string) {
    // get continents with the most regions
    const continents = world.continents.sort((a, b) => b.regions.length - a.regions.length);
    // start player in a region that has is_costal_region = true on the largest continent of the map
    // with a preference of region.ylocation to be 2, 3 or 4.
    const startingRegions = continents[0].regions.filter(region => region.is_costal_region &&
      region.ylocation >= 2 && region.ylocation <= 4);
    // if no regions are found with the above criteria then select a region from another continent with the same criteria
    if (startingRegions.length === 0) {
      for (let i = 1; i < continents.length; i++) {
        const continent = continents[i];
        const regions = continent.regions.filter(region => region.is_costal_region &&
          region.ylocation >= 2 && region.ylocation <= 4);
        if (regions.length > 0) {
          startingRegions.push(regions[0]);
          break;
        }
      }
    }
    // Create Civilization
    const civilization: Civilization = createCivilizationObj(uuidv4(), world.created_player_id, world.id);
    civilization.civilization_name = civilizationName || 'Unknown';
    // select a random region from the list of starting regions
    const startingRegion = startingRegions[Math.floor(Math.random() * startingRegions.length)];
    const startingContinent = world.continents.find(continent => continent.id === startingRegion.continent_id);
    console.log('starting region', startingRegion);
    civilization.discovered_continents.push(startingContinent);
    civilization.discovered_regions.push(startingRegion);
    startingRegion.has_player_activity = true;
    const playerActivity = createRegionPlayerActivityObj(
      world.created_player_id, world.id, startingRegion.continent_id, startingRegion.id);
    playerActivity.id = uuidv4();
    playerActivity.explored_percent = .01;
    playerActivity.civilization_id = civilization.id;
    startingRegion.players_activity_ids.push(playerActivity.id);
    // Create Starting Colonist and Party
    this.createInitialParty(world, startingRegion, playerActivity);
    return civilization;
  }

  private createInitialParty(world: GameWorld, startingRegion: Region, playerActivity: RegionPlayerActivity) {
    const startingColonist: Colonist = createColonistObj(playerActivity.player_id, world.id,
      startingRegion.continent_id, startingRegion.id, uuidv4());
    const party: Party = createPartyObj(startingColonist.player_id, world.id, startingRegion.continent_id, startingRegion.id, uuidv4());
    startingColonist.assigned_party_id = party.id;
    party.colonist_ids.push(startingColonist.id);
    party.colonists.push(startingColonist);
    // Assign Starting Resources
    party.resources.push({ name_id: 'berries', amount: 20, operator: 'sum' });
    party.resources.push({ name_id: 'wood', amount: 10, operator: 'sum' });
    playerActivity.party_ids.push(party.id);
    playerActivity.parties.push(party);
    startingRegion.players_activity.push(playerActivity);
  }

  private setRegionTerrainType(world: GameWorld, terrainList: TerrainType[]) {
    let randomTerrainByRSICount = 0;
    this.normalizeRSI(terrainList);
    const terrainTotals = this.computeSuggestedTotals(world, terrainList);
    world.total_terrain_types = terrainTotals;
    console.log('world', world);
    let iterations = 0;
    for (let continent of world.continents) {
      for (let region of continent.regions) {
        // Filter terrains that can be applied to the current region
        const possibleTerrains = terrainList.filter(terrain => this.isTerrainPossibleForRegion(terrain, region));
        // Sort the possible terrains by RSI and how close we are to fulfilling the suggestedTotal
        possibleTerrains.sort((a, b) => {
          const terrainAInfo = world.total_terrain_types.get(a.name)!;
          const terrainBInfo = world.total_terrain_types.get(b.name)!;
          const differenceA = terrainAInfo.suggestedTotal - terrainAInfo.count;
          const differenceB = terrainBInfo.suggestedTotal - terrainBInfo.count;

          return (b.terrain_rsi + differenceB) - (a.terrain_rsi + differenceA);
        });

        // Select the best terrain for the region
        if (possibleTerrains.length) {
          const chosenTerrain = possibleTerrains[0];
          region.terrain_type = chosenTerrain;
          const chosenTerrainInfo = world.total_terrain_types.get(chosenTerrain.name)!;
          chosenTerrainInfo.count += 1;
        } else {
          // Default to getting a Random Terrain
          region.terrain_type = this.getRandomTerrainByRSI(terrainList);
          const randomTerrainInfo = world.total_terrain_types.get(region.terrain_type.name)!;
          randomTerrainInfo.count += 1;
          randomTerrainByRSICount++
        }

        iterations++;

        // Rebalancing if necessary
        if (iterations > 2000) {
          for (let [terrainName, terrainInfo] of world.total_terrain_types.entries()) {
            if (terrainInfo.count < terrainInfo.suggestedTotal) {
              region.terrain_type = terrainList.find(terrain => terrain.name === terrainName)!;
              terrainInfo.count += 1;
            }
          }
        }
      }
    }
    if (randomTerrainByRSICount > 0) {
      console.warn('Number of Regions not assigned by User Selections', randomTerrainByRSICount);
      console.warn('Total number of Regions', iterations);
    }
  }

  private isTerrainPossibleForRegion(terrain: TerrainType, region: Region): boolean {
    if (!terrain.is_possible_in_coast && region.is_costal_region) {
      return false;
    }
    if (!terrain.is_possible_with_fresh_water && region.has_fresh_water) {
      return false;
    }
    return (
      terrain.possible_ylocations.includes(region.ylocation) &&
      terrain.possible_hill_lvl.includes(region.hill_lvl) &&
      terrain.possible_forestry_lvl.includes(region.forestry_lvl) &&
      terrain.possible_temperature_lvl.includes(region.temperature_lvl) &&
      terrain.possible_rainfall_lvl.includes(region.rainfall_lvl)
    );
  }

  private getRandomTerrainByRSI(terrainList: TerrainType[]): TerrainType {
    // Get a random number between 0 and 100
    const randomValue = Math.random() * 100;
    let cumulativeProbability = 0;
    for (const terrain of terrainList) {
      cumulativeProbability += terrain.terrain_rsi!;
      if (randomValue <= cumulativeProbability) {
        return terrain;
      }
    }
    // In case of an error or unexpected scenario, return the first terrain type (you can change this)
    return terrainList[0];
  }

  private normalizeRSI(terrainList: TerrainType[]): void {
    const totalRSI = terrainList.reduce((acc, terrain) => acc + (terrain.terrain_rsi || 0), 0);
    terrainList.forEach(terrain => {
      if (terrain.terrain_rsi !== undefined) {
        terrain.terrain_rsi = (terrain.terrain_rsi / totalRSI) * 100;
      }
    });
  }

  private computeSuggestedTotals(world: GameWorld, terrainList: TerrainType[]): Map<string, { suggestedTotal: number, count: number }> {
    const totals = new Map<string, { suggestedTotal: number, count: number }>();
    terrainList.forEach(terrain => {
      if (terrain.terrain_rsi !== undefined) {
        const suggestedTotal = Math.ceil((terrain.terrain_rsi / 100) * world.total_land);
        totals.set(terrain.name, { suggestedTotal, count: 0 });
      }
    });
    return totals;
  }

  private setRegionWaterAmount(world: GameWorld, forestry: string, rainfall: string) {
    const WorldRainLvl = this.getFreshWaterValue(rainfall) * 10; // ranges from 1 to 5
    const baseGroundWater = this.baseGroundWater;
    const groundWaterMultiplier = this.getGroundWaterValue(rainfall);
    const baseForestryLvl = this.getForestryValue(forestry);

    world.continents.forEach(continent => {
      continent.regions.forEach(region => {
        const yLocation = region.ylocation;
        const temperature = region.temperature_lvl;
        const hillLvl = region.hill_lvl;
        const hasFreshWater = region.has_fresh_water;
        const hasCoast = region.is_costal_region;

        // Rain Water Calculation
        let rainFactor = WorldRainLvl * 0.3
          + yLocation * 0.1
          + temperature * 0.05
          + (hasCoast ? 0.5 : 0)
          - (hillLvl === 2 ? 1 : 0)
          + (Math.random() * 2);  // Adding randomness

        rainFactor = Math.max(1, Math.min(5, Math.round(rainFactor))); // Ensuring rainFactor stays between 1 and 5

        region.rainfall_lvl = rainFactor;

        // Ground Water Calculation
        let groundWaterFactor = baseGroundWater
          + rainFactor * 20 * groundWaterMultiplier
          - (hillLvl === 1 ? 10 : 0)  // hills may drain some water
          - (hillLvl === 2 ? 30 : 0); // mountains drain more water

        region.ground_water_amount = groundWaterFactor;

      });
    });
  }

  private setRegionForestryLevel(world: GameWorld, forestry: string, rainfall: string) {
    const WorldRainLvl = this.getFreshWaterValue(rainfall) * 10; // ranges from 1 to 5
    const baseForestryLvl = this.getForestryValue(forestry);

    world.continents.forEach(continent => {
      continent.regions.forEach(region => {
        const yLocation = region.ylocation;
        const temperature = region.temperature_lvl;
        const hillLvl = region.hill_lvl;
        const hasFreshWater = region.has_fresh_water;
        const hasCoast = region.is_costal_region;

        if (yLocation === 0) console.error('yLocation: ', yLocation);

        // Forestry Level Calculation
        // Use baseForestryLvl as the starting point
        region.forestry_lvl = baseForestryLvl;

        // Adjustments based on temperature and rainfall
        if (temperature >= 4 && WorldRainLvl >= 3) {
          region.forestry_lvl += 1;
        } else if (temperature <= 2 || WorldRainLvl <= 2) {
          region.forestry_lvl -= 1;
        }

        // Slight adjustments for yLocation and hills
        if (yLocation <= 2) {
          region.forestry_lvl -= 0.5;
        } else if (yLocation >= 4) {
          region.forestry_lvl += 0.5;
        }

        if (hillLvl > 0) {
          region.forestry_lvl -= 0.5;
        }

        // Ensure forestryLvl stays within the range [1, 3]
        region.forestry_lvl = Math.max(1, Math.min(3, region.forestry_lvl));

        // (Rest of the code remains unchanged...)


      });
      // Check for variation and adjust
      let forestryCounts: { [key: number]: number } = { 1: 0, 2: 0, 3: 0 };
      continent.regions.forEach(region => {
        forestryCounts[region.forestry_lvl]++;
      });

      const threshold = continent.regions.length * 0.6;  // adjust this threshold as needed

      Object.keys(forestryCounts).forEach(levelStr => {
        const level = +levelStr;
        if (forestryCounts[level] > threshold) {
          // We need more variation
          let adjusted = 0;
          for (let region of continent.regions) {
            if (region.forestry_lvl === level && adjusted < threshold / 4) {  // adjust a quarter, can be tweaked
              if (level === 1) region.forestry_lvl += 1;
              else if (level === 3) region.forestry_lvl -= 1;
              adjusted++;
            }
          }
        }
      });

      // Adjust Region.forestryLvl to whole numbers
      continent.regions.forEach(region => {
        region.forestry_lvl = Math.round(region.forestry_lvl);
      });
    });
  }

  private setTopography(world: GameWorld, hillLvl: string) {
    // Gets the total amount of Mountains and Hills in the world map
    const topography = world.total_land * this.getHillsLvlValue(hillLvl);
    const totalMountain = topography * this.getRandomInclusiveFloat(0.2, 0.35);
    const totalHills: number = topography - totalMountain;
    // Distribute mountains and hills to continents based on their size
    world.continents.forEach(continent => {
      const regionCount = continent.regions.length;
      // Assign proportionate mountains and hills to this continent
      const continentMountains = Math.round((regionCount / world.total_land) * totalMountain);
      const continentHills = Math.round((regionCount / world.total_land) * totalHills);

      let assignedMountains = 0;
      let assignedHills = 0;

      while (assignedMountains < continentMountains) {
        // Randomly select a region as the starting point for a mountain range
        const startIdx = Math.floor(Math.random() * regionCount);

        if (continent.regions[startIdx].hill_lvl === 0) {
          continent.regions[startIdx].hill_lvl = 2;  // Set as mountain
          assignedMountains++;

          // Create range around this mountain. The range can be 2-4 regions.
          const rangeSize = this.getRandomInclusiveFloat(2, 4);

          for (let i = 1; i < rangeSize; i++) {
            const nextIdx = startIdx + i < regionCount ? startIdx + i : startIdx - i;
            if (continent.regions[nextIdx].hill_lvl === 0 && assignedHills < continentHills) {
              continent.regions[nextIdx].hill_lvl = 1;  // Set as hill
              assignedHills++;
            }
          }
        }
      }
      // Fill in remaining hills (outside of ranges)
      while (assignedHills < continentHills) {
        const hillIdx = Math.floor(Math.random() * regionCount);
        if (continent.regions[hillIdx].hill_lvl === 0) {
          continent.regions[hillIdx].hill_lvl = 1;  // Set as hill
          assignedHills++;
        }
      }
    });
  }

  private setRegionTemperature(continents: Continent[], worldTemperature: number) {
    continents.forEach(continent => {
      const yLocationMin = continent.yLocationMin;
      const yLocationMax = continent.yLocationMax;
      // Determine the base average temperature level for the continent
      let avgTemp = Math.round((yLocationMin + yLocationMax) / 2);
      let yLocation = Math.round((yLocationMin + yLocationMax) / 2);
      if (yLocation == 0) yLocation = 1;
      // Adjust the average temperature based on world temperature.
      avgTemp += (worldTemperature - 3); // since 3 is temperate and neutral
      // Ensure avgTemp is within the range [1,5]
      avgTemp = Math.max(1, Math.min(5, avgTemp));
      const regionCount = continent.regions.length;
      // Track counts of each temperature level for the continent
      let tempCounts = [0, 0, 0, 0, 0, 0];  // Extra zero for easy indexing (1-5)
      // Helper function to adjust temperature based on current counts
      const adjustTemperature = (temp: number): number => {
        // Check if this temperature level has been used "too much"
        if (tempCounts[temp] >= Math.ceil(regionCount / 5)) {
          // Try to adjust up or down
          if (temp > 1 && tempCounts[temp - 1] < Math.ceil(regionCount / 5)) {
            return temp - 1;
          } else if (temp < 5 && tempCounts[temp + 1] < Math.ceil(regionCount / 5)) {
            return temp + 1;
          }
        }
        return temp;
      };
      // Assign temperatures to regions, ensuring at least one region gets avgTemp
      const avgTempRegionIdx = Math.floor(Math.random() * regionCount);
      continent.regions[avgTempRegionIdx].temperature_lvl = avgTemp;
      tempCounts[avgTemp]++;
      // Assign temperatures to the other regions with a random offset from avgTemp
      for (let i = 0; i < regionCount; i++) {
        continent.regions[i].ylocation = yLocation;
        if (i === avgTempRegionIdx) continue; // Skip the one we already assigned

        const randomOffset = Math.floor(Math.random() * 3) - 1; // random number between -1 and 1
        let regionTemp = avgTemp + randomOffset;
        // Lower the temperature by the hillLvl of the region
        regionTemp -= continent.regions[i].hill_lvl;

        // Ensure regionTemp is within the range [1,5]
        regionTemp = Math.max(1, Math.min(5, regionTemp));

        // Adjust temperature if the count of this temp exceeds a threshold
        regionTemp = adjustTemperature(regionTemp);

        continent.regions[i].temperature_lvl = regionTemp;
        tempCounts[regionTemp]++;
      }
    });
  }

  private setWaterSources(world: GameWorld, rainfall: string) {
    let totalWaterSources = this.getFreshWaterValue(rainfall) * world.total_land;
    let waterSource = 0;
    while (waterSource < totalWaterSources) {
      // get a random continent
      const continentIndex = this.getRandomInclusive(0, world.continents.length - 1);
      const continent = world.continents[continentIndex];
      // get a random region
      const regionIndex = this.getRandomInclusive(0, continent.regions.length - 1);
      const region = continent.regions[regionIndex];
      // if the region already has a fresh water source then get a new region
      if (region.has_fresh_water) {
        continue;
      }
      // set the region to have a fresh water source
      region.has_fresh_water = true;
      continent.totalWaterSources++;
      waterSource++;
      // Exits loop if it goes on for too long
      if (waterSource > 2000) {
        break;
      }
    }
  }

  private createContinents(world: GameWorld, mapSize: string, mapType: string): Continent[] {
    const numberOfContinents = this.getNumberOfContients(mapSize, mapType);
    const continents: Continent[] = [];
    for (let i = 0; i < numberOfContinents; i++) {
      let continent: Continent = createContinentsObj();
      continent.id = uuidv4();
      continent.world_id = world.id;
      continent.continent_number = i.toString();
      continent.yLocationMin = this.getRandomInclusive(1, 5);
      continent.yLocationMax = this.getRandomInclusive(1, 5);
      if (continent.yLocationMin > continent.yLocationMax) {
        const temp = continent.yLocationMin;
        continent.yLocationMin = continent.yLocationMax;
        continent.yLocationMax = temp;
      }
      world.continent_ids.push(continent.id);
      continents.push(continent);
    }
    // Sets the total number of coasts each continent has
    const coastPercent = this.getPercentageOfCoast(mapType);
    const totalNumberOfCoasts = world.total_land * coastPercent;
    let coastNumber = 0;
    // assures that every continent gets at least 1 coast
    continents.forEach(continent => {
      continent.totalCoasts++;
      coastNumber++;
    });
    while (coastNumber < totalNumberOfCoasts) {
      const continentIndex = this.getRandomInclusive(0, numberOfContinents - 1);
      const continent = continents[continentIndex];

      continent.totalCoasts++;
      coastNumber++;
    }
    return continents
  }

  private createBaseRegionsWithCoasts(world: GameWorld) {
    const totalNumberOfRegions = world.total_land;
    let regionCount = 0;
    world.continents.forEach(continent => {
      // For each continent create all costal regions
      for (let index = 0; index < continent.totalCoasts; index++) {
        const region = createRegionObj();
        region.world_id = world.id;
        region.continent_id = continent.id;
        region.id = uuidv4();
        region.is_costal_region = true;
        continent.region_ids.push(region.id);
        continent.regions.push(region);
        regionCount++;
      }
    });
    // Fill the rest of the contients with regions while regionCount < totalNumberOfRegions
    while (regionCount < totalNumberOfRegions) {
      // get a random continent
      const continentIndex = this.getRandomInclusive(0, world.continents.length - 1);
      const continent = world.continents[continentIndex];
      const region = createRegionObj();
      region.world_id = world.id;
      region.continent_id = continent.continent_number;
      region.id = uuidv4();
      continent.regions.push(region);
      regionCount++;
    }
  }

  private getMapSize(mapSize: string): number {
    switch (mapSize) {
      case 'tiny':
        return this.tinySize;
      case 'small':
        return this.smallSize;
      case 'medium':
        return this.mediumSize;
      case 'large':
        return this.largeSize;
      case 'huge':
        return this.hugeSize;
      default:
        throw new Error(`Unknown mapSize: ${mapSize}`);
    }
    return 0;
  }

  private getNumberOfContients(mapSize: string, mapType: string): number {
    if (mapType === 'pangaea') {
      return 1;
    } else if (mapType === 'continents') {
      switch (mapSize) {
        case 'tiny':
          return this.getRandomInclusive(this.tinyContinentLow, this.tinyContinentHigh);
        case 'small':
          return this.getRandomInclusive(this.smallContinentLow, this.smallContinentHigh);
        case 'medium':
          return this.getRandomInclusive(this.mediumContinentLow, this.mediumContinentHigh);
        case 'large':
          return this.getRandomInclusive(this.largeContinentLow, this.largeContinentHigh);
        case 'huge':
          return this.getRandomInclusive(this.hugeContinentLow, this.hugeContinentHigh);
        default:
          throw new Error(`Unknown mapSize: ${mapSize}`);
      }
    } else if (mapType === 'archipelago') {
      switch (mapSize) {
        case 'tiny':
          return this.getRandomInclusive(this.tinyArchipelagoLow, this.tinyArchipelagoHigh);
        case 'small':
          return this.getRandomInclusive(this.smallArchipelagoLow, this.smallArchipelagoHigh);
        case 'medium':
          return this.getRandomInclusive(this.mediumArchipelagoLow, this.mediumArchipelagoHigh);
        case 'large':
          return this.getRandomInclusive(this.largeArchipelagoLow, this.largeArchipelagoHigh);
        case 'huge':
          return this.getRandomInclusive(this.hugeArchipelagoLow, this.hugeArchipelagoHigh);
        default:
          throw new Error(`Unknown mapSize: ${mapSize}`);
      }
    }
    return 0;
  }

  private getPercentageOfCoast(mapType: string): number {
    switch (mapType) {
      case 'pangaea':
        return this.getRandomInclusiveFloat(this.pangaeaMapLow, this.pangaeaMapHigh);
      case 'continents':
        return this.getRandomInclusiveFloat(this.continentsMapLow, this.continentsMapHigh);
      case 'archipelago':
        return this.getRandomInclusiveFloat(this.archipelagoMapLow, this.archipelagoMapHigh);
    }
    return 0;
  }

  private getSeaLvlValue(seaLvl: string): number {
    switch (seaLvl) {
      case 'low':
        return this.sealLvlLow;
      case 'medium':
        return this.sealLvlMedium;
      case 'high':
        return this.sealLvlHigh;
    }
    return 0;
  }

  private getHillsLvlValue(hillLvl: string): number {
    switch (hillLvl) {
      case 'flat':
        return this.hillsLvlFlat;
      case 'average':
        return this.hillsLvlAverage;
      case 'hills':
        return this.hillsLvlHills;
    }
    return 0;
  }

  private getForestryValue(forestry: string): number {
    switch (forestry) {
      case 'low':
        return this.forestryLow;
      case 'medium':
        return this.forestryMedium;
      case 'high':
        return this.forestryHigh;
    }
    return 0;
  }

  private getTemperatureValue(temperature: string): number {
    switch (temperature) {
      case 'frozen':
        return this.temperatureFrozen;
      case 'cold':
        return this.temperatureCold;
      case 'temperate':
        return this.temperatureTemperate;
      case 'hot':
        return this.temperatureHot;
      case 'scorching':
        return this.temperatureScorching;
    }
    return 0;
  }

  private getFreshWaterValue(rainfall: string): number {
    switch (rainfall) {
      case 'sand':
        return this.freshWaterSand;
      case 'arid':
        return this.freshWaterArid;
      case 'average':
        return this.freshWaterAverage;
      case 'wet':
        return this.freshWaterWet;
      case 'flooded':
        return this.freshWaterFlooded;
    }
    return 0;
  }

  private getGroundWaterValue(rainfall: string): number {
    switch (rainfall) {
      case 'sand':
        return this.groundWaterSand;
      case 'arid':
        return this.groundWaterArid;
      case 'average':
        return this.groundWaterAverage;
      case 'wet':
        return this.groundWaterWet;
      case 'flooded':
        return this.groundWaterFlooded;
    }
    return 0;
  }

  private getRandomInclusive(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  private getRandomInclusiveFloat(min: number, max: number) {
    // get a random number between min and max that is less then 1
    const random = Math.random() * (max - min) + min;
    // round the number to 2 decimal places
    return Math.round(random * 100) / 100;
  }
}
