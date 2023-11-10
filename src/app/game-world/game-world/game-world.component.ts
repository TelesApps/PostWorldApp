import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { skip, take, Subscription } from 'rxjs';
import { Civilization } from 'src/app/interfaces/civilization.interface';
import { GameWorld } from 'src/app/interfaces/game-world.interface';
import { Player } from 'src/app/interfaces/player.interface';
import { RegionPlayerActivity } from 'src/app/interfaces/player_activity.interface';
import { Region } from 'src/app/interfaces/regions.interface';
import { Party } from 'src/app/interfaces/party.interface';
import { AuthService } from 'src/app/services/auth.service';
import { EngineService } from 'src/app/services/engine.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { StorageService } from 'src/app/services/storage.service';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-game-world',
  templateUrl: './game-world.component.html',
  styleUrls: ['./game-world.component.scss']
})

export class GameWorldComponent implements OnInit, OnDestroy {

  civilization: Civilization
  civSubscription$: Subscription;
  playersActivity: RegionPlayerActivity[];

  playersActivitySub$: Subscription;
  selectedRegion: Region;
  selectedParty: Party;
  gametime = 0
  progressValue = 40;

  constructor(
    private auth: AuthService,
    public engine: EngineService,
    private firebase: FirebaseService,
    private supabase: SupabaseService,
    public storage: StorageService) { }

  ngOnInit(): void {
    this.loadGameState();
  }

  async loadGameState() {
    let player: Player = await this.auth.getPlayer();
    this.civSubscription$ = this.engine.civilization.subscribe(civ => {
      this.civilization = civ;
      this.gametime++;
    });
    this.playersActivitySub$ = this.engine.allPlayerActivity.subscribe(pa => {
      this.playersActivity = pa;
    });

    this.testDevelopment();
  }

  testDevelopment() {
    // Use this function to load game durring development
    if (!this.civilization) {
      this.firebase.getCivilizationWithId('d00ce21e-a525-482d-970b-761bb4874fbf').then(civ => {
        this.civilization = civ;
        console.log('this.civilization: ', this.civilization);
      });
    }
    if (!this.playersActivity) {
      this.firebase.getAllPlayerActivity("claudioteles85@gmail.com_1699101872452").then(pa => {
        this.engine.allPlayerActivity.next(pa);
        console.log('this.playersActivity: ', this.playersActivity);
      });
    }
  }

  testChangeTheme() {
    this.storage.changeTheme();
    // this.supabase.getResourceUrl('wood').then(url => {
    //   console.log('url: ', url);
    // });
    // this.supabase.getAllResources().then(resources => {
    //   console.log('resources: ', resources);
    // });
  }

  getRegionActivities(region: Region): RegionPlayerActivity[] {
    if (this.playersActivity) {
      return this.playersActivity.filter(pa => pa.region_id === region.id);
    }
    else return null;
  }


  onSelectRegion(region: Region) {
    this.selectedParty = null;
    this.selectedRegion = region;
  }

  onPartySelected(party: Party, event: Event) {
    event.stopPropagation();
    this.selectedRegion = null;
    console.log('onPartySelected: ', party);
    this.selectedParty = party;
  }

  getRegionExploredValue(): number {
    const activities = this.getRegionActivities(this.selectedRegion);
    const activity = activities.find(a => a.civilization_id === this.civilization.id);
    if (activity) {
      return activity.explored_percent;
    }
    else
      return 0
  }

  ngOnDestroy(): void {
    this.engine.stopEngine();
    if (this.civSubscription$)
      this.civSubscription$.unsubscribe();
    if (this.playersActivitySub$)
      this.playersActivitySub$.unsubscribe();
  }
}
