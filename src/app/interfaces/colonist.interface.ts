
export interface Colonist {
    player_id: string;
    world_id: string;
    continent_id: string;
    region_id: string;
    id: string;
    assigned_residence_id: string;
    assigned_building_id: string;
    assigned_party_id: string;
    aggregate: number;
    first_name: string;
    last_name: string;
    gender: 'male' | 'female';
    age: number; // measured in seconds
    last_update?: Date;
    last_updated_game_time?: number;

    food: number; // 1 consumes .1 per second if he misses a day this value goes down by .1 otherwise it goes up by .2
    energy_level: number; // 1 * food
    happy_lvl: number; // 0.01 affected by events.
    sad_lvl: number; // -0.01 - (.1 - food) affected by events and food.
    happiness_modifier: number; // 0 + Dice Roll from Sadness to Happiness. -> update it a every Colonist Audits.
    core_happiness: number; // 0.5 + happiness_modifier
    morale: number; // 1 * (core_happiness + 0.5)
    tool_efficiency: number; //  starts at 0;
    base_production: number; // start as .5 in future maybe make it -> 0.5 * housing_bonus;
    PPS: number; //production_per_second -> base_production + (Skill level + tool_efficiency) * morale * energy_level
    status: 'idle' | 'working' | 'in-party';
    health_status: 'healthy' | 'disabled' | 'sick' | 'hungry' | 'starving';

    // Skills Levels
    skill_research: number; // 1 * morale * energy_level
    skill_production: number; //starts at 0.5;
    skill_exploring: number; // starts at 0.5;
    skill_melee_combat: number;
    skill_range_combat: number;
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
        aggregate: 1,
        first_name: 'John',
        last_name: 'Smith',
        gender: 'male',
        age: 7300,

        food: 1,
        energy_level: 1,
        happy_lvl: 0.01,
        sad_lvl: 0.01,
        happiness_modifier: 0,
        core_happiness: 0.5,
        morale: 1,
        tool_efficiency: 0,
        base_production: 0.5,
        PPS: 0.5,
        status: 'idle',
        health_status: 'healthy',

        skill_research: 0,
        skill_exploring: 0.5,
        skill_production: 0.5,
        skill_melee_combat: 0.5,
        skill_range_combat: 0.5,
    }
}