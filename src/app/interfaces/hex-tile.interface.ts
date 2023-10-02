// tiny = 19x12 small = 26x16 medium = 33x20 large = 38x24 huge = 45x28
enum MapSize { tiny, small, medium, large, huge }
enum MapType { pangaea, continents, archipelago }
enum SeaLvl { low, medium, high }
enum HillsLvl { flat, average, hills }
enum Forestry { low, medium, high }
enum TileTemperatureType { Frozen, Cold, Temperate, Hot, Scorching }
enum TileRainfallType { Sand, Arid, Average, Wet, Flooded }

export enum TerrainType {
    Alpine_tundra, Arctic_tundra, Badlands, Canyon, Desert_dunes, Dry_lake, Estuary, Forest_deciduous, Forest_coniferous, Glacier, Grassland, Hill,
    Jungle, Karst, Marsh, Mountain, Oasis, Ocean, Plains, Plateau, Savannah, Swamp, Valley, Volcano
}

export interface Tile {
    x: number;
    y: number;
    id: string; // The id of the is made up of the x and y coordinates
    terrainType: TerrainType;
    isLand: boolean;
    hasRiverSource: boolean; // This tile has a river source
    isCostalTile: boolean; // this tile is on the coast of a landmass
    neighboringTilesId: string[]; // The tiles that are next to this tile Hex
}

// This enum is based on the Tile Hexes from my Post World Project in unity
// enum TileType {
//     DesertDune, Dirt, ForestBroadleaf, Highlands, Hills, Marsh, Mountain, Ocean, Plains, Scrubland, Woodlands,
//     DirtCold, ForestPine, ForestPineTransition, ForestPineSnow, HillCold, HillCave, HillTransition, HillTransitionCave, HillSnow, HillSnowCave,
//     MountainSnow, MountainSnowCave, OceanIceberg, PlainsCold, PlainsPond, PlainsTransition, PlainsTransitionPond, PlainsSnow, PlainsSnowPond,
//     Snowfield, RedDirt, RedForest, RedForestOasis, RedGrass, RedGrassDunes, RedGrassOasis, RedHills, RedHillsOasis, RedMesa, RedMesaCave,
//     RedMountain, RedMountainsCave, YellowCacti, YellowCrater, YellowDirt, YellowDunes, YellowHills, YellowHillsOasis, YellowMesa, YellowMesaCave,
//     YellowMesaOasis, YellowMountains, YellowMountainsCave, YellowSaltFlat, Bog, GrassySand, GrassySandPalms, Jungle, Sand, SandPalms,
//     Swamp, PlainsTropical, Wetlands
// }
