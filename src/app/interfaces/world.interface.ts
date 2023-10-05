export interface GameWorld {
    id: string;
    createdPlayerId: string;
    gameDifficulty: string;
    mapSize: string;
    mapType: string;
    seaLvl: string;
    hillLvl: string;
    forestry: string;
    temperature: string;
    rainfall: string;

    totalLand: number;
    totalOcean: number;
    totalTerrainTypes: Map<string, {suggestedTotal: number, count: number}>;
    continents: Continent[];
    playerIds: string[];
    civilizationIds: string[];
    currentDate: string;
    gameSpeedMultiplier: number;
    gameTimeSeconds: number;
}

export interface GameSettings {
    
}

export function createWorldObj(): GameWorld {
    return {
        id: '',
        createdPlayerId: '',
        gameDifficulty: '',
        mapSize: '',
        mapType: '',
        seaLvl: '',
        hillLvl: '',
        forestry: '',
        temperature: '',
        rainfall: '',

        totalLand: 0,
        totalOcean: 0,
        totalTerrainTypes: new Map(),
        continents: [],
        playerIds: [],
        civilizationIds: [],
        currentDate: '',
        gameSpeedMultiplier: 1,
        gameTimeSeconds: 0
    }
}

export interface Continent {
    id: string;
    world_id: string;
    continent_id: string;
    totalCoasts: number;
    totalWaterSources: number;
    yLocationMin: number;
    yLocationMax: number;
    regions: Region[];
}

export function createContinentsObj(): Continent {
    return {
        id: '',
        world_id: '',
        continent_id: '',
        totalCoasts: 0,
        totalWaterSources: 0,
        yLocationMin: 3,
        yLocationMax: 3,
        regions: []
    }
}

export interface Region {
    world_id: string;
    continent_id: string;
    id: string;
    is_costal_region: boolean;
    has_fresh_water: boolean;
    yLocation: number;
    hillLvl: number;
    forestryLvl: number;
    temperatureLvl: number;
    rainfallLvl: number;
    terrain_type: TerrainType;
    ground_water_amount: number;
}

export function createRegionObj(): Region {
    return {
        world_id: '',
        continent_id: '',
        id: '',
        terrain_type: {
            airtable_id: '',
            name: 'ocean',
            label: 'Ocean',
            terrain_rsi: 0,
            is_possible_in_coast: false,
            is_possible_with_fresh_water: false,
            possible_ylocations: [],
            possible_hill_lvl: [],
            possible_forestry_lvl: [],
            possible_temperature_lvl: [],
            possible_rainfall_lvl: []
        },
        is_costal_region: false,
        has_fresh_water: false,
        yLocation: 0,
        ground_water_amount: 0,
        hillLvl: 0,
        forestryLvl: 0,
        temperatureLvl: 0,
        rainfallLvl: 0
    }
}

export interface TerrainType {
    airtable_id: string;
    name: 'alpine_tundra' | 'arctic_tundra' | 'badlands' | 'canyon' | 'desert_dunes' | 'dry_lake' | 'estuary' |
    'forest_deciduous' | 'forest_coniferous' | 'glacier' | 'grassland' | 'hill' | 'jungle' | 'karst' | 'marsh' | 'mountain' |
    'oasis' | 'ocean' | 'plains' | 'plateau' | 'savannah' | 'swamp' | 'valley' | 'volcano';
    label: 'Alpine Tundra' | 'Arctic Tundra' | 'Badlands' | 'Canyon' | 'Desert Dunes' | 'Dry Lake' | 'Estuary' |
    'Forest Deciduous' | 'Forest Coniferous' | 'Glacier' | 'Grassland' | 'Hill' | 'Jungle' | 'Karst' | 'Marsh' | 'Mountain' |
    'Oasis' | 'Ocean' | 'Plains' | 'Plateau' | 'Savannah' | 'Swamp' | 'Valley' | 'Volcano';
    terrain_rsi: number,
    is_possible_in_coast: boolean,
    is_possible_with_fresh_water: boolean,
    possible_ylocations: number[],
    possible_hill_lvl: number[],
    possible_forestry_lvl: number[],
    possible_temperature_lvl: number[],
    possible_rainfall_lvl: number[],
}

