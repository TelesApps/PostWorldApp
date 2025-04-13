import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment'
import { GameWorld, TerrainType } from '../interfaces/game-world.interface';
import { Resource } from '../interfaces/resource.interface';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import terrainTypesLibrary from 'database/terrain_types_library.json';
import resourceLibrary from 'database/resource_library.json';
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

  updateResourcesJson() {
    const resources: Resource[] = <Resource[]>resourceLibrary;
    console.log('resources: ', resources);
    this.afs.collection('libraries').doc('resources').set({ resources });
  }

  //FINISHED ADMIN SECTION

  getAllTerrainTypes(): Promise<TerrainType[]> {
    // Get All Terrain Types from the firestore database
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
    }).catch((error: any): TerrainType[] => {
      console.log('Error getting document:', error);
      return [];
    });
  }

  // Get All of the resources from resource library
  async getAllResources(): Promise<Resource[]> {
    // Get all resources from the firestore database
    return lastValueFrom(this.afs.collection('libraries').doc('resources').get()).then((doc) => {
      if (doc.exists) {
        const data: any = doc.data();
        console.log('resources data: ', data);
        const resources: Resource[] = <Resource[]>data?.resources;
        return resources;
      } else {
        console.log('No such document!');
        return [];
      }
    }).catch((error: any): Resource[] => {
      console.log('Error getting document:', error);
      return [];
    });
  }

  async getResource(nameId: string) {
    if (this.resources_cashe.has(nameId)) {
      return this.resources_cashe.get(nameId);
    } else {
      console.warn('Resource not found in cache, fetching from database');
      const resources = await this.getAllResources();
      const resource = resources.find((resource) => resource.name_id === nameId);
      if (resource) {
        this.resources_cashe.set(nameId, resource);
        return resource;
      } else {
        console.log('Resource not found in database');
        return null;
      }
    }
    
  }



}
