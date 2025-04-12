import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment'
import { GameWorld, TerrainType } from '../interfaces/game-world.interface';
import { Resource } from '../interfaces/resource.interface';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import terrainTypesLibrary from 'database/terrain_types_library.json';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LibraryDataService {

  private url_cashe: Map<string, string> = new Map();
  private resources_cashe: Map<string, Resource> = new Map();

  constructor(private afs: AngularFirestore) {
    console.log('Supabase database Connected')
  }

  // ADMIN UPDATE TERRAIN TYPES MASTER JSON FILE
  updateTerrainTypesJson() {
    const terrain_types: TerrainType[] = <TerrainType[]>terrainTypesLibrary;
    console.log('terrainTypes: ', terrain_types);
    this.afs.collection('libraries').doc('terrain_types').set({ terrain_types });
    
  }

  getAllTerrainTypes(): Promise<TerrainType[]> {
    // Get ALl Terrain Types from the firestore database
    return lastValueFrom(this.afs.collection('libraries').doc('terrain_types').get()).then((doc) => {
      if (doc.exists) {
        const data: any = doc.data();
        console.log('terrain types data: ', data);
        const terrainTypes: TerrainType[] = <TerrainType[]>data?.terrain_types;
        return terrainTypes;
      } else {
        console.log('No such document!');
        return [];
      }
    }).catch((error) => {
      console.log('Error getting document:', error);
      return [];
    });
  }

  // Get All of the resources from resource library
  async getAllResources(): Promise<Resource[]> {
    // return empty array until migration is done
    return [];
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
