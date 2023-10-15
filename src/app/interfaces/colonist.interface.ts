
export interface Colonist {
    player_id: string;
    world_id: string;
    continent_id: string;
    region_id: string;
    id: string;
    assigned_residence_id: string;
    assigned_building_id: string;
    assigned_party_id: string;
    first_name: string;
    last_name: string;
    age: number;
    last_update?: Date;
    last_updated_game_time?: number;

    base_production: number;
}

export function createColonistObj(player_id: string, world_id: string, continent_id: string, region_id: string, id: string): Colonist {
    return {
        player_id: player_id,
        world_id: world_id,
        continent_id: continent_id,
        region_id: region_id,
        id: id,
        assigned_residence_id: '',
        assigned_building_id: '',
        assigned_party_id: '',
        first_name: 'John',
        last_name: 'Smith',
        age: 7300,
        base_production: 0
    }
}