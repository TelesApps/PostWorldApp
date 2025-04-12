export interface Resource {
    name_id: string;
    label: string;
    resource_type: 'raw' | 'material' | 'food' | 'equipment'; // raw materials are picked up directly from the terrain_type.
    source?: ResourceCalc[]; // Where this resource comes from and how much of it is needed to create this resource.
    labor_pc: number; // Labor Production cost
    yield_amount: number;
    spawn_rate: number;
    spoil_rate: number; // Number of seconds before one unit spoils.
    techs_req: string[];
    grow_time: number;
    water_consumption: number;
    img_url: string;
}

export interface ResourceCalc {
    name_id: string;
    amount: number;
    operator: 'sum'| 'add' | 'subtract' | 'multiply' | 'divide';
}

