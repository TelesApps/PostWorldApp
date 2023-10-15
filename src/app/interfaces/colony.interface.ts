import { Resource } from "./resource.interface";

export interface Colony {
    buildings: Building[];
    colonist_ids: string[];
    colonists?: Colonist[];
    resources?: Resource[];
}

export interface Building {
    player_id: string;
    world_id: string;
    continent_id: string;
    region_id: string;
    id: string;
    assigned_colonists: Colonist[];
}

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