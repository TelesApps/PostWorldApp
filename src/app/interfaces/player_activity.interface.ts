import { Colony } from "./colony.interface";
import { Party } from "./party.interface";

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
    party_ids: string[];
    parties?: Party[];
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
        party_ids: [],
        parties: [],
        colony: {
            buildings: [],
            colonist_ids: [],
            colonists: [],
            resources: []
        }
    }
}