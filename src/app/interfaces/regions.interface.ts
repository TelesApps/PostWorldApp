import { TerrainType } from "./game-world.interface";

export interface Region {
    id: string;
    continent_id: string;
    world_id: string;
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