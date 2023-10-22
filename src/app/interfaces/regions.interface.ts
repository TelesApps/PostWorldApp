import { Colonist } from "./colonist.interface";
import { TerrainType } from "./game-world.interface";
import { RegionPlayerActivity } from "./player_activity.interface";
import { Resource } from "./resource.interface";

export interface Region {
    id: string;
    continent_id: string;
    world_id: string;
    is_costal_region: boolean;
    has_fresh_water: boolean;
    ylocation: number;
    hill_lvl: number;
    forestry_lvl: number;
    temperature_lvl: number;
    rainfall_lvl: number;
    terrain_type: TerrainType;
    ground_water_amount: number;
    current_temperature?: number;
    region_resources?: Resource[];
    has_player_activity: boolean;
    player_activity_ids: string[];
    player_activity?: RegionPlayerActivity[];
    is_selected_in_map: boolean;
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
        ylocation: 0,
        ground_water_amount: 0,
        hill_lvl: 0,
        forestry_lvl: 0,
        temperature_lvl: 0,
        rainfall_lvl: 0,
        region_resources: [],
        has_player_activity: false,
        player_activity_ids: [],
        player_activity: [],
        is_selected_in_map: false
    }
}

export interface Party {
    id: string;
    player_owner_id: string;
    world_id: string;
    current_continent_id: string;
    current_region_id: string;
    civilization_id: string;
    colonist_ids: string[];
    colonists?: Colonist[];
}

export function createPartyObj(player_owner_id: string, world_id: string, 
    current_continent_id: string, current_region_id: string, id: string): Party {
    return {
        id: id,
        player_owner_id: player_owner_id,
        world_id: world_id,
        current_continent_id: current_continent_id,
        current_region_id: current_region_id,
        civilization_id: '',
        colonist_ids: [],
        colonists: []
    }
}
