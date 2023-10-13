// tiny = 19x12 small = 26x16 medium = 33x20 large = 38x24 huge = 45x28
enum MapSize { tiny, small, medium, large, huge }
enum MapType { pangaea, continents, archipelago }
enum SeaLvl { low, medium, high }
enum HillsLvl { flat, average, hills }
enum Forestry { low, medium, high }
enum TileTemperatureType { Frozen, Cold, Temperate, Hot, Scorching }
enum TileRainfallType { Sand, Arid, Average, Wet, Flooded }

export enum TerrainType {
    
    alpine_tundra, arctic_tundra, badlands, canyon, dry_lake, estuary, forest_deciduous, forest_coniferous, glacier, 
    grassland, jungle, karst, mountains, oasis, ocean, plateau, savannah, swamp, valley, volcano,   
    highlands, hills, scrubland, dirt_cold, plains_cold, plains_pond, plains_snow,
    snowfield, red_dirt, red_forest_oasis, red_grass_dunes, red_grass_oasis, red_mesa, red_mesa_cave, red_mountain, red_mountains_cave, 
    yellow_cacti, yellow_crater, yellow_hills, yellow_hills_oasis, yellow_mesa, yellow_mesa_cave, yellow_mesa_oasis, yellow_mountains, 
    yellow_salt_flat, bog, grassy_sand, grassy_sand_palms, sand, sand_palms, wetlands, 
    hot_dry_deserts, semi_arid_deserts, coastal_deserts, rain_shadow_deserts, polar_deserts,  
    dry_forests, pampas, prairies, desert_grasslands, patagonian_grasslands, mongolian_manchurian_grassland, 
    tallgrass_prairie, mangrove
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
enum TileType {
    DesertDune, Dirt, ForestBroadleaf, Highlands, Hills, Marsh, Mountain, Ocean, Plains, Scrubland, Woodlands,
    DirtCold, ForestPine, ForestPineTransition, ForestPineSnow, HillCold, HillCave, HillTransition, HillTransitionCave, HillSnow, HillSnowCave,
    MountainSnow, MountainSnowCave, OceanIceberg, PlainsCold, PlainsPond, PlainsTransition, PlainsTransitionPond, PlainsSnow, PlainsSnowPond,
    Snowfield, RedDirt, RedForest, RedForestOasis, RedGrass, RedGrassDunes, RedGrassOasis, RedHills, RedHillsOasis, RedMesa, RedMesaCave,
    RedMountain, RedMountainsCave, YellowCacti, YellowCrater, YellowDirt, YellowDunes, YellowHills, YellowHillsOasis, YellowMesa, YellowMesaCave,
    YellowMesaOasis, YellowMountains, YellowMountainsCave, YellowSaltFlat, Bog, GrassySand, GrassySandPalms, Jungle, Sand, SandPalms,
    Swamp, PlainsTropical, Wetlands
}
