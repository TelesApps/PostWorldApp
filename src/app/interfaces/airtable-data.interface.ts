export interface AirTableData {
    records: Record[];
}

export interface Record {
    id:          string;
    createdTime: string;
    fields:      Fields;
}

export interface Fields {
    airtable_id?:                   string;
    name?:                          string;
    label?:                         string;
    terrain_rsi?:                   number;
    is_possible_in_coast?:         boolean;
    is_possible_with_fresh_water?: boolean;
    possible_ylocations?:           string[];
    possible_temperature_lvl?:      string[];
    possible_forestry_lvl?:         string[];
    possible_hill_lvl?:             string[];
    possible_rainfall_lvl?:         string[];
}
