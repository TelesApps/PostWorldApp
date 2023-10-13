import { Injectable } from '@angular/core';
import { TerrainType, Tile } from '../interfaces/hex-tile.interface';

@Injectable({
  providedIn: 'root'
})
export class HexCreationService {

  readonly tinySizeX: number = 19;
  readonly tinySizeY: number = 12;
  readonly smallSizeX: number = 26;
  readonly smallSizeY: number = 16;
  readonly mediumSizeX: number = 33;
  readonly mediumSizeY: number = 20;
  readonly largeSizeX: number = 38;
  readonly largeSizeY: number = 28;
  readonly hugeSizeX: number = 45;
  readonly hugeSizeY: number = 28;
  readonly hillsLvlFlat: number = 0.1;
  readonly hillsLvlAverage: number = 0.2;
  readonly hillsLvlHills: number = 0.3;
  readonly forestryLow: number = 0.3;
  readonly forestryMedium: number = 0.5;
  readonly forestryHigh: number = 0.7;
  readonly temperatureFrozen: number = 0.1;
  readonly temperatureCold: number = 0.2;
  readonly temperatureTemperate: number = 0.3;
  readonly temperatureHot: number = 0.4;
  readonly temperatureScorching: number = 0.5;
  readonly rainfallSand: number = 0.5;
  readonly rainfallArid: number = 0.8;
  readonly rainfallAverage: number = 1;
  readonly rainfallWet: number = 1.5;
  readonly rainfallFlooded: number = 2;

  readonly pangaeaMapSeed: number = 0.4;
  readonly continentsMapSeed: number = 0.5;
  readonly archipelagoMapSeed: number = 0.6;
  readonly sealLvlLow: number = 0.7;
  readonly sealLvlMedium: number = .8;
  readonly sealLvlHigh: number = .9;
  readonly automataSmoothingIterations: number = 3;




  constructor() { }

  public calculateCostalPercentage(mapSize: string, mapType: string, seaLvl: string) {
    const world = this.createWorld(mapSize, mapType, seaLvl);
    // from all of the tiles that has the flag .isLand, calculate what percentage of them has the .isCostalTile flag
    let totalLand = 0;
    let totalCostal = 0;
    for (let y = 0; y < world.length; y++) {
      for (let x = 0; x < world[y].length; x++) {
        if (world[y][x].isLand) {
          totalLand++;
          if (world[y][x].isCostalTile) {
            totalCostal++;
          }
        }
      }
    }
    const costalPercent = totalCostal / totalLand;
    return costalPercent;
  }

  public createWorld(mapSize: string, mapType: string, seaLvl: string) {
    // The world is an array of tiles, each tile is a hexagon
    let world: Tile[][] = [];
    const sizeX = this.getSizeX(mapSize);
    const sizeY = this.getSizeY(mapSize);
    const seaLvlValue = this.getSeaLvlValue(seaLvl);

    // The number of tiles that are land, needs to be calculated based on the map size and sea level
    world = this.generateLandAndOcean(sizeX, sizeY, seaLvlValue, mapType);

    // this.generateTopography(world, hillLvl);

    // this.generateTerrain(world, hillLvl, forestry, temperature, rainfall);
    return world;
  }

  private generateTopography(world: Tile[][], hillLvl: string) {
    const hillsLvlValue = this.getHillsLvlValue(hillLvl);
    // Get all land tiles into a flat array for easier manipulation
    const landTiles = [];
    for (let y = 0; y < world.length; y++) {
      for (let x = 0; x < world[y].length; x++) {
        if (world[y][x].isLand) {
          landTiles.push(world[y][x]);
        }
      }
    }

    // Calculate the number of tiles to turn into mountains/hills
    const numToChange = Math.floor(landTiles.length * hillsLvlValue);

    // Shuffle landTiles to get a random order
    landTiles.sort(() => 0.5 - Math.random());

    // Set the first few to be mountains, and the rest to be hills
    for (let i = 0; i < numToChange; i++) {
      if (i < numToChange * 0.3) {  // You can adjust this ratio
        landTiles[i].terrainType = TerrainType.mountains;
      } else {
        landTiles[i].terrainType = TerrainType.hills;
      }
    }
  }

  private generateTerrain(world: Tile[][], hillLvl: string, forestry: string, temperature: string, rainfall: string) {
    const hillsLvlValue = this.getHillsLvlValue(hillLvl);
    const forestryValue = this.getForestryValue(forestry);
    const temperatureValue = this.getTemperatureValue(temperature);
    const rainfallValue = this.getRainfallValue(rainfall);
    // Generate the terrain for each tile based on values passed in

  }

  private generateLandAndOcean(sizeX: number, sizeY: number, seaLvlValue: number, mapType: string): Tile[][] {
    let world: Tile[][] = [];

    // Step 1: Generate Initial Land Mass
    for (let y = 0; y < sizeY; y++) {
      world[y] = [];
      for (let x = 0; x < sizeX; x++) {
        let noise = Math.random();
        // Modify threshold by considering both the seaLvlValue and the map type seed
        let threshold = this.getMapTypeSeed(mapType) * seaLvlValue;
        world[y][x] = {
          x: x,
          y: y,
          id: `${x}-${y}`,
          terrainType: TerrainType.ocean,
          isLand: noise > threshold,
          hasRiverSource: false,
          isCostalTile: false,
          neighboringTilesId: this.getNeighboringIds(x, y, sizeX, sizeY)
        };
      }
    }

    // Step 2: Cellular Automata Smoothing
    const iterations = this.automataSmoothingIterations; // Choose the number of iterations based on how smooth you want the land to be
    for (let i = 0; i < iterations; i++) {
      world = this.applyCellularAutomata(world);
    }

    // Step 3: Determine Coastal Tiles
    for (let y = 0; y < sizeY; y++) {
      for (let x = 0; x < sizeX; x++) {
        if (world[y][x].isLand) {
          if (this.isCoastalTile(x, y, world)) {
            world[y][x].isCostalTile = true;
          }
        }
      }
    }

    return world;
  }

  private applyCellularAutomata(world: Tile[][]): Tile[][] {
    let newWorld = JSON.parse(JSON.stringify(world)); // Deep copy
    for (let y = 0; y < world.length; y++) {
      for (let x = 0; x < world[0].length; x++) {
        let landNeighbors = this.countLandNeighbors(x, y, world);
        if (landNeighbors >= 4) {
          newWorld[y][x].isLand = true;
        } else {
          newWorld[y][x].isLand = false;
        }
      }
    }
    return newWorld;
  }

  private countLandNeighbors(x: number, y: number, world: Tile[][]): number {
    // Hexagonal neighbor offsets for even and odd rows
    const evenOffsets = [
      { dx: 0, dy: -1 },   // Above
      { dx: 1, dy: -1 },   // Upper right
      { dx: 1, dy: 0 },    // Right
      { dx: 0, dy: 1 },    // Below
      { dx: -1, dy: 0 },   // Left
      { dx: -1, dy: -1 }   // Upper left
    ];

    const oddOffsets = [
      { dx: 0, dy: -1 },   // Above
      { dx: 1, dy: 0 },    // Upper right
      { dx: 1, dy: 1 },    // Right
      { dx: 0, dy: 1 },    // Below
      { dx: -1, dy: 1 },   // Left
      { dx: -1, dy: 0 }    // Upper left
    ];

    let offsets = y % 2 === 0 ? evenOffsets : oddOffsets;

    let landCount = 0;
    for (let offset of offsets) {
      let newX = x + offset.dx;
      let newY = y + offset.dy;
      if (newX >= 0 && newX < world[0].length && newY >= 0 && newY < world.length && world[newY][newX].isLand) {
        landCount++;
      }
    }
    return landCount;
  }

  private getNeighboringIds(x: number, y: number, sizeX: number, sizeY: number): string[] {
    // Determine offsets based on even/odd row
    const isOddRow = y % 2 !== 0;

    const offsetsEven = [
      { dx: 1, dy: -1 },
      { dx: 1, dy: 0 },
      { dx: 1, dy: 1 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: -1 },
    ];

    const offsetsOdd = [
      { dx: 0, dy: -1 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 1 },
      { dx: -1, dy: 0 },
      { dx: -1, dy: -1 },
    ];

    const offsets = isOddRow ? offsetsOdd : offsetsEven;

    const neighboringIds = offsets.map(offset => {
      const nx = x + offset.dx;
      const ny = y + offset.dy;

      // If the neighboring coordinate is out of the grid, return null
      if (nx < 0 || ny < 0 || nx >= sizeX || ny >= sizeY) {
        return null;
      }

      return `${nx}-${ny}`;
    });

    return neighboringIds;
  }

  private isCoastalTile(x: number, y: number, world: Tile[][]): boolean {
    // Define potential neighbor positions based on the row being even or odd
    const neighbors = y % 2 === 0
      ? [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 0]]
      : [[-1, -1], [0, -1], [1, 0], [0, 1], [-1, 1], [-1, 0]];

    for (let [dx, dy] of neighbors) {
      let nx = x + dx;
      let ny = y + dy;

      // Check if the position is inside the world
      if (nx >= 0 && ny >= 0 && nx < world[0].length && ny < world.length) {
        if (!world[ny][nx].isLand) {
          return true;  // Found at least one ocean neighbor
        }
      }
    }
    return false;
  }

  private getMapTypeSeed(mapType: string): number {
    switch (mapType) {
      case 'pangaea':
        return this.pangaeaMapSeed;
      case 'continents':
        return this.continentsMapSeed;
      case 'archipelago':
        return this.archipelagoMapSeed;
      default:
        throw new Error(`Unknown mapType: ${mapType}`);
    }
  }

  private getSizeX(mapSize: string): number {
    switch (mapSize) {
      case 'tiny':
        return this.tinySizeX;
      case 'small':
        return this.smallSizeX;
      case 'medium':
        return this.mediumSizeX;
      case 'large':
        return this.largeSizeX;
      case 'huge':
        return this.hugeSizeX;
    }
    return 0;
  }
  private getSizeY(mapSize: string): number {
    switch (mapSize) {
      case 'tiny':
        return this.tinySizeY;
      case 'small':
        return this.smallSizeY;
      case 'medium':
        return this.mediumSizeY;
      case 'large':
        return this.largeSizeY;
      case 'huge':
        return this.hugeSizeY;
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

  private getRainfallValue(rainfall: string): number {
    switch (rainfall) {
      case 'sand':
        return this.rainfallSand;
      case 'arid':
        return this.rainfallArid;
      case 'average':
        return this.rainfallAverage;
      case 'wet':
        return this.rainfallWet;
      case 'flooded':
        return this.rainfallFlooded;
    }
    return 0;
  }

  private getNumberOfRivers(mapSize: string, rainfallLvl: string): number {
    const rainfallValue = this.getRainfallValue(rainfallLvl);
    switch (mapSize) {
      case 'tiny':
        return Math.floor(this.tinySizeX * this.tinySizeY * rainfallValue);
      case 'small':
        return Math.floor(this.smallSizeX * this.smallSizeY * rainfallValue);
      case 'medium':
        return Math.floor(this.mediumSizeX * this.mediumSizeY * rainfallValue);
      case 'large':
        return Math.floor(this.largeSizeX * this.largeSizeY * rainfallValue);
      case 'huge':
        return Math.floor(this.hugeSizeX * this.hugeSizeY * rainfallValue);
    }
    return 0;
  }

}
