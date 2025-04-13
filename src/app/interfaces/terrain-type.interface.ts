// See README file for full description of these values
export interface TerrainType {
    id: number;
    name: string;
    label: string;
    terrain_rsi: number;
    is_possible_in_coast: boolean;
    is_possible_with_fresh_water: boolean;
    possible_ylocations: number[];
    possible_hill_lvl: number[];
    possible_forestry_lvl: number[];
    possible_temperature_lvl: number[];
    possible_rainfall_lvl: number[];
}


