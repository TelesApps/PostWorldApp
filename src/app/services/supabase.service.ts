import { Injectable } from '@angular/core';
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js'
import { environment } from 'src/environments/environment'
import { SupabaseData } from '../interfaces/supabase-data.interface';
import { GameWorld, TerrainType } from '../interfaces/game-world.interface';
import { Resource } from '../interfaces/resource.interface';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  private supabase: SupabaseClient
  private url_cashe: Map<string, string> = new Map();
  private resources_cashe: Map<string, Resource> = new Map();

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
    console.log('Supabase database Connected')
  }

  getSupabase() {
    return this.supabase;
  }

  async getAllTerrainTypes(): Promise<TerrainType[]> {
    //return 
    const promiseData = (await this.supabase.from('Terrain Types').select('*')).data;
    if (promiseData) {
      console.log('promiseData from supabase: ', promiseData);
      return promiseData;
    } else {
      throw new Error('No Terrain Types found');
    }
  }

  // Get All of the resources from resource library
  async getAllResources(): Promise<Resource[]> {
    const promiseData = (await this.supabase.from('Resource Library').select('*')).data;
    if (promiseData) {
      console.log('promiseData from supabase: ', promiseData);
      return promiseData;
    } else {
      throw new Error('No Resources found');
    }
  }

  async getResource(nameId: string): Promise<Resource> {
    // Get resource from cashe first if available
    const resource = this.resources_cashe.get(nameId);
    if (resource) {
      return resource;
    } else {
      const promiseData = (await this.supabase.from('Resource Library').select('*').eq('name_id', nameId)).data;
      console.log('promiseData from supabase: ', promiseData);
      if (promiseData && promiseData[0]) {
        this.resources_cashe.set(nameId, promiseData[0]);
        return promiseData[0];
      } else {
        throw new Error('No Resources found');
      }
    }
  }


  addRow() {
    this.supabase
      .from('Resource Library')
      .insert([
        { some_column: 'someValue', other_column: 'otherValue' },
      ])
      .select()

  }

}
