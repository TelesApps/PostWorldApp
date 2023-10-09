import { Region } from "./regions.interface";

export interface Continent {
    id: string;
    world_id: string;
    continent_number: string;
    totalCoasts: number;
    totalWaterSources: number;
    yLocationMin: number;
    yLocationMax: number;
    regions: Region[];
}

export function createContinentsObj(): Continent {
    return {
        id: '',
        world_id: '',
        continent_number: '',
        totalCoasts: 0,
        totalWaterSources: 0,
        yLocationMin: 3,
        yLocationMax: 3,
        regions: []
    }
}