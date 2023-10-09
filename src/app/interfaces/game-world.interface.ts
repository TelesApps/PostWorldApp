import { Continent } from "./continents.interface";

export interface GameWorld {
    id: string;
    game_name: string;
    created_player_id: string;
    game_difficulty: string;
    map_size: string;
    map_type: string;
    sea_lvl: string;
    hill_lvl: string;
    forestry: string;
    temperature: string;
    rainfall: string;

    total_land: number;
    total_ocean: number;
    total_terrain_types: Map<string, {suggestedTotal: number, count: number}>;
    continents: Continent[];
    player_ids: string[];
    civilization_ids: string[];
    creation_date: Date;
    current_date: Date;
    game_speed_multiplier: number;
    game_time_seconds: number; // defines how many seconds have passed in the game
}

export interface GameSettings {
    
}

export function createWorldObj(): GameWorld {
    return {
        id: '',
        game_name: '',
        created_player_id: '',
        game_difficulty: '',
        map_size: '',
        map_type: '',
        sea_lvl: '',
        hill_lvl: '',
        forestry: '',
        temperature: '',
        rainfall: '',

        total_land: 0,
        total_ocean: 0,
        total_terrain_types: new Map(),
        continents: [],
        player_ids: [],
        civilization_ids: [],
        creation_date: new Date(),
        current_date: new Date(),
        game_speed_multiplier: 0,
        game_time_seconds: 0
    }
}

export interface TerrainType {
    airtable_id: string;
    name: string;
    label: string;
    terrain_rsi: number,
    is_possible_in_coast: boolean,
    is_possible_with_fresh_water: boolean,
    possible_ylocations: number[],
    possible_hill_lvl: number[],
    possible_forestry_lvl: number[],
    possible_temperature_lvl: number[],
    possible_rainfall_lvl: number[],
}

