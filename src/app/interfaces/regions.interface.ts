import { Colony } from "./colony.interface";
import { TerrainType } from "./game-world.interface";
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
    region_resources?: Resource[];
    has_player_activity: boolean;
    player_activity_ids: string[];
    player_activity?: RegionPlayerActivity[];
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
        player_activity: []
    }
}
export interface RegionPlayerActivity {
    id: string;
    player_id: string;
    world_id: string;
    continent_id: string;
    region_id: string;
    is_region_owner: boolean;
    civilization_id: string;
    is_explored: boolean;
    is_colonized: boolean;
    explored_percent: number;
    colony?: Colony;
}

export function createRegionPlayerActivityObj(
    player_id: string, world_id: string, continent_id: string, region_id: string): RegionPlayerActivity {
    return {
        id: '',
        player_id: player_id,
        world_id: world_id,
        continent_id: continent_id,
        region_id: region_id,
        is_region_owner: false,
        civilization_id: '',
        is_explored: false,
        is_colonized: false,
        explored_percent: 0,
        colony: {
            buildings: [],
            colonist_ids: [],
            colonists: [],
            resources: []
        }
    }
}
