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

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  private supabase: SupabaseClient

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
    console.log('Supabase database Connected')
  }

  getSupabase() {
    return this.supabase;
  }

  async getAllTerrainTypes(): Promise<TerrainType[]> {
    return (await this.supabase.from('Terrain Types').select('*')).data;
  }

}
