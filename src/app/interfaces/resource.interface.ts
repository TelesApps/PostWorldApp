export interface Resource {
    library_id: string;
    name_id: string;
    label: string;
    resource_type: string;
    required_for: ResourceCalc[];
    labor_pc: number;
    produced_amount: number;
    spawn_rate: number;
    spoil_rate: number; // Number of seconds before one unit spoils.

}

export interface ResourceCalc {
    name_id: string;
    amount: number;
    operator: 'add' | 'subtract' | 'sum'| 'multiply' | 'divide';
}

