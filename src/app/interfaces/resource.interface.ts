export interface Resource {
    library_id: string;
    name_id: string;
    label: string;
    resource_type: 'raw' | 'material' | 'food' | 'equipment';
    source: ResourceCalc[];
    labor_pc: number;
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

