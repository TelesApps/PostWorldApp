import { Colonist } from "./colonist.interface";
import { ResourceCalc } from "./resource.interface";

export interface Party {
    id: string;
    player_owner_id: string;
    world_id: string;
    current_continent_id: string;
    current_region_id: string;
    civilization_id: string;
    activity: 'exploring' | 'idle' | 'foraging' | 'scouting';
    activity_progress: number;
    resources: ResourceCalc[];
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
        activity: 'idle',
        activity_progress: 0,
        resources: [],
        colonist_ids: [],
        colonists: []
    }
}