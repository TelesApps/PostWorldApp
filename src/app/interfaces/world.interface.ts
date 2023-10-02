export interface GameWorld {
    id: string;
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
    continents: Continents[];
    playerIds: string[];
    civilizationIds: string[];
    currentDate: string;
    gameSpeedMultiplier: number;
    gameTimeSeconds: number;
}

export function createWorldObj(): GameWorld {
    return {
        id: '',
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
        continents: [],
        playerIds: [],
        civilizationIds: [],
        currentDate: '',
        gameSpeedMultiplier: 1,
        gameTimeSeconds: 0
    }
}

export interface Continents {
    id: string;
    world_id: string;
    continent_id: string;
    totalCoasts: number;
    yLocationMin: number;
    yLocationMax: number;
    regions: Region[];
}

export function createContinentsObj(): Continents {
    return {
        id: '',
        world_id: '',
        continent_id: '',
        totalCoasts: 0,
        yLocationMin: 3,
        yLocationMax: 3,
        regions: []
    }
}

export interface Region {
    world_id: string;
    continent_id: string;
    id: string;
    terrain_type: TerrainType;
    is_costal_region: boolean;
    has_fresh_water: boolean;
    ground_water_amount: number;
}

export function createRegionObj(): Region {
    return {
        world_id: '',
        continent_id: '',
        id: '',
        terrain_type: {
            airtable_id: '',
            name: 'plains',
            label: 'Plains'
        },
        is_costal_region: false,
        has_fresh_water: false,
        ground_water_amount: 0
    }
}

enum EnumTerrainTypes {
    Alpine_tundra, Arctic_tundra, Badlands, Canyon, Desert_dunes, Dry_lake, Estuary, Forest_deciduous, Forest_coniferous, Glacier, Grassland, Hill,
    Jungle, Karst, Marsh, Mountain, Oasis, Ocean, Plains, Plateau, Savannah, Swamp, Valley, Volcano
}

export interface TerrainType {
    airtable_id: string;
    name: 'alpine_tundra' | 'arctic_tundra' | 'badlands' | 'canyon' | 'desert_dunes' | 'dry_lake' | 'estuary' |
    'forest_deciduous' | 'forest_coniferous' | 'glacier' | 'grassland' | 'hill' | 'jungle' | 'karst' | 'marsh' | 'mountain' |
    'oasis' | 'ocean' | 'plains' | 'plateau' | 'savannah' | 'swamp' | 'valley' | 'volcano';
    label: 'Alpine Tundra' | 'Arctic Tundra' | 'Badlands' | 'Canyon' | 'Desert Dunes' | 'Dry Lake' | 'Estuary' |
    'Forest Deciduous' | 'Forest Coniferous' | 'Glacier' | 'Grassland' | 'Hill' | 'Jungle' | 'Karst' | 'Marsh' | 'Mountain' |
    'Oasis' | 'Ocean' | 'Plains' | 'Plateau' | 'Savannah' | 'Swamp' | 'Valley' | 'Volcano';
}