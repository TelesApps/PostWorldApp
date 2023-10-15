export interface Colonist {
    player_id: string;
    world_id: string;
    continent_id: string;
    region_id: string;
    id: string;
    assigned_residence_id: string;
    assigned_building_id: string;
    // Alot of additional data for each colonists here, name, happiness, etc.
}

export function createColonistObj(player_id: string, world_id: string, continent_id: string, region_id: string, id: string): Colonist {
    return {
        player_id: player_id,
        world_id: world_id,
        continent_id: continent_id,
        region_id: region_id,
        id: id,
        assigned_residence_id: '',
        assigned_building_id: ''
    }
}