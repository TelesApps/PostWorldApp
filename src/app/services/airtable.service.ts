import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AirTableData } from '../interfaces/airtable-data.interface';
import { Observable, map } from 'rxjs';
import { TerrainType } from '../interfaces/world.interface';

@Injectable({
  providedIn: 'root'
})
export class AirtableService {
  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + environment.airtable_token
  });
  options = {
    headers: this.httpHeaders,
  };

  readonly BASE_URL = 'https://api.airtable.com/v0/appvJBXwhr7iqH9Jk'
  readonly TABLE_ID_TERRAIN_TYPE = '/tblWLK6CUVVfRr0A8'
  // Boolean Type values in airtable does not return false values, so we need to set them manually
  private defaultTerrainType: Partial<TerrainType> = {
    is_possible_in_coast: false,
    is_possible_with_fresh_water: false
  };


  constructor(private http: HttpClient) { }

  getTerrainTypes() {
    const sortNameAscending: string = '?sort%5B0%5D%5Bfield%5D=name&sort%5B0%5D%5Bdirection%5D=asc'
    const url = this.BASE_URL + this.TABLE_ID_TERRAIN_TYPE + sortNameAscending;
    return <Observable<TerrainType[]>>this.fetchTableFromAirtable(url);
  }

  private fetchTableFromAirtable(url: string): Observable<any[]> {
    return this.http.get<AirTableData>(url, this.options).pipe(
      map(data => data.records.map(record => {
        // Convert string arrays to number arrays
        const possible_hill_lvl = record.fields.possible_hill_lvl?.map(Number);
        const possible_forestry_lvl = record.fields.possible_forestry_lvl?.map(Number);
        const possible_temperature_lvl = record.fields.possible_temperature_lvl?.map(Number);
        const possible_rainfall_lvl = record.fields.possible_rainfall_lvl?.map(Number);
        const possible_ylocations = record.fields.possible_ylocations?.map(Number);
        // ... Do this for any other fields as needed

        return {
          ...this.defaultTerrainType,
          ...record.fields,
          ...(possible_hill_lvl && { possible_hill_lvl }), // Only add if it exists
          ...(possible_forestry_lvl && { possible_forestry_lvl }),
          ...(possible_temperature_lvl && { possible_temperature_lvl }),
          ...(possible_rainfall_lvl && { possible_rainfall_lvl }),
          ...(possible_ylocations && { possible_ylocations }),
          // ... Do this for any other fields as needed
        }
      }))
    );
  }
}
