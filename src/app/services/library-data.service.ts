import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment'
import { GameWorld, TerrainType } from '../interfaces/game-world.interface';
import { Resource } from '../interfaces/resource.interface';

@Injectable({
  providedIn: 'root'
})
export class LibraryDataService {

  private url_cashe: Map<string, string> = new Map();
  private resources_cashe: Map<string, Resource> = new Map();

  constructor() {
    console.log('Supabase database Connected')
  }

  async getAllTerrainTypes() {
    //return 
    // const promiseData = (await this.supabase.from('Terrain Types').select('*')).data;
    // if (promiseData) {
    //   console.log('promiseData from supabase: ', promiseData);
    //   return promiseData;
    // } else {
    //   throw new Error('No Terrain Types found');
    // }
  }

  // Get All of the resources from resource library
  async getAllResources(){
    // const promiseData = (await this.supabase.from('Resource Library').select('*')).data;
    // if (promiseData) {
    //   console.log('promiseData from supabase: ', promiseData);
    //   return promiseData;
    // } else {
    //   throw new Error('No Resources found');
    // }
  }

  async getResource(nameId: string) {
    
  }



}
