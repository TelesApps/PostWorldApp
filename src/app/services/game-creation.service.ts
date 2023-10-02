import { Injectable } from '@angular/core';
import { GameWorld, Continents, createWorldObj, createContinentsObj, createRegionObj } from '../interfaces/world.interface';
import { HexCreationService } from './hex-creation.service';

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
  readonly freshWaterSand: number = 0.01;
  readonly freshWaterArid: number = 0.02;
  readonly freshWaterAverage: number = 0.03;
  readonly freshWaterWet: number = 0.04;
  readonly freshWaterFlooded: number = 0.05;
  // multiplier for the amount of ground water in a region
  readonly groundWaterSand: number = 0.25;
  readonly groundWaterArid: number = 0.5;
  readonly groundWaterAverage: number = 1;
  readonly groundWaterWet: number = 1.5;
  readonly groundWaterFlooded: number = 2;
  // percentage of land that has mountains and hills
  readonly hillsLvlFlat: number = 0.1;
  readonly hillsLvlAverage: number = 0.25;
  readonly hillsLvlHills: number = 0.33;
  // percentage of land that has forests and jungles
  readonly forestryLow: number = 0.15;
  readonly forestryMedium: number = 0.3;
  readonly forestryHigh: number = 0.45;
  // The temperature of the world along with the rainfall determines the terrain type
  readonly temperatureFrozen: number = 0.0;
  readonly temperatureCold: number = 0.25;
  readonly temperatureTemperate: number = 0.5;
  readonly temperatureHot: number = 0.75;
  readonly temperatureScorching: number = 1.0;


  constructor() { }

  createWorld(mapSize: string, mapType: string, seaLvl: string, hillLvl: string,
    forestry: string, temperature: string, rainfall: string) {
    const world: GameWorld = createWorldObj();
    world.mapSize = mapSize;
    world.mapType = mapType;
    world.seaLvl = seaLvl;
    world.hillLvl = hillLvl;
    world.forestry = forestry;
    world.temperature = temperature;
    world.rainfall = rainfall;
    world.totalLand = this.getMapSize(mapSize) * (1 - this.getSeaLvlValue(seaLvl));
    world.totalOcean = this.getMapSize(mapSize) * this.getSeaLvlValue(seaLvl);
    world.continents = this.createContinents(world, mapSize, mapType);
    this.createBaseRegionsWithCoasts(world);

    this.setTerrainTypeForRegions(world, hillLvl, forestry, temperature, rainfall);

    return world;
  }

  setTerrainTypeForRegions(world: GameWorld, hillLvl: string,
    forestry: string, temperature: string, rainfall: string) {
    const freshWaterPercent = this.getFreshWaterValue(rainfall);
    const groundWaterPercent = this.getGroundWaterValue(rainfall);
    const hillsPercent = this.getHillsLvlValue(hillLvl);
    const forestryPercent = this.getForestryValue(forestry);
    const temperaturePercent = this.getTemperatureValue(temperature);
    const rainfallPercent = this.getFreshWaterValue(rainfall);
    const groundWaterMultiplier = this.getGroundWaterValue(rainfall);
    const continents = world.continents;
    continents.forEach(continent => {
      console.log('yLocationMin/Max: ', continent.yLocationMin, continent.yLocationMax);
      const yTemperature = continent
    });

  }

  createContinents(world: GameWorld, mapSize: string, mapType: string): Continents[] {
    const numberOfContinents = this.getNumberOfContients(mapSize, mapType);
    const continents: Continents[] = [];
    for (let i = 0; i < numberOfContinents; i++) {
      let continent: Continents = createContinentsObj();
      continent.world_id = world.id;
      continent.continent_id = i.toString();
      continent.yLocationMin = this.getRandomInclusive(1, 5);
      continent.yLocationMax = this.getRandomInclusive(1, 5);
      if (continent.yLocationMin > continent.yLocationMax) {
        const temp = continent.yLocationMin;
        continent.yLocationMin = continent.yLocationMax;
        continent.yLocationMax = temp;
      }
      continents.push(continent);
    }
    // Sets the total number of coasts each continent has
    const coastPercent = this.getPercentageOfCoast(mapType);
    const totalNumberOfCoasts = world.totalLand * coastPercent;
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

  createBaseRegionsWithCoasts(world: GameWorld) {
    const totalNumberOfRegions = world.totalLand;
    let regionCount = 0;
    world.continents.forEach(continent => {
      // For each continent create all costal regions
      for (let index = 0; index < continent.totalCoasts; index++) {
        const region = createRegionObj();
        region.world_id = world.id;
        region.continent_id = continent.continent_id;
        region.id = regionCount.toString();
        region.is_costal_region = true;
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
      region.continent_id = continent.continent_id;
      region.id = regionCount.toString();
      continent.regions.push(region);
      regionCount++;
    }
  }

  getMapSize(mapSize: string): number {
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

  getNumberOfContients(mapSize: string, mapType: string): number {
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

  getPercentageOfCoast(mapType: string): number {
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

  getSeaLvlValue(seaLvl: string): number {
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

  getHillsLvlValue(hillLvl: string): number {
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

  getForestryValue(forestry: string): number {
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

  getTemperatureValue(temperature: string): number {
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

  getFreshWaterValue(rainfall: string): number {
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

  getGroundWaterValue(rainfall: string): number {
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

  getRandomInclusive(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  getRandomInclusiveFloat(min: number, max: number) {
    // get a random number between min and max that is less then 1
    const random = Math.random() * (max - min) + min;
    // round the number to 2 decimal places
    return Math.round(random * 100) / 100;
  }
}
