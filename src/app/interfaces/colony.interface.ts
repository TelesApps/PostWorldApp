import { Colonist } from "./colonist.interface";
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
