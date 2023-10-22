import { Continent } from "./continents.interface";
import { Region } from "./regions.interface";

export interface Civilization {
    id: string;
    player_id: string;
    world_id: string;
    civilization_name: string;
    discovered_continents: Continent[];
    discovered_regions: Region[];
    world_explored_percent: number;
    explored_perspective: number;
    // Add logic for technology
}

export function createCivilizationObj(id: string, player_id: string, world_id: string): Civilization {
    return {
        id: id,
        player_id: player_id,
        world_id: world_id,
        civilization_name: '',
        discovered_continents: [],
        discovered_regions: [],
        world_explored_percent: 0,
        explored_perspective: 0
    }
}