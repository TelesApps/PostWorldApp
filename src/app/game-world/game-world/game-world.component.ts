import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { skip, take, Subscription } from 'rxjs';
import { Civilization } from 'src/app/interfaces/civilization.interface';
import { GameWorld } from 'src/app/interfaces/game-world.interface';
import { Player } from 'src/app/interfaces/player.interface';
import { RegionPlayerActivity } from 'src/app/interfaces/player_activity.interface';
import { Party, Region } from 'src/app/interfaces/regions.interface';
import { AuthService } from 'src/app/services/auth.service';
import { EngineService } from 'src/app/services/engine.service';
import { FirebaseService } from 'src/app/services/firebase.service';

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

  constructor(private auth: AuthService, public engine: EngineService, private firebase: FirebaseService) { }

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
      this.firebase.getCivilizationWithId('93213836-acf2-4ed4-8578-58e4af6a04c8').then(civ => {
        this.civilization = civ;
        console.log('this.civilization: ', this.civilization);
      });
    }
    if(!this.playersActivity) {
      this.firebase.getAllPlayerActivity("claudioteles85@gmail.com_1697811615942").then(pa => {
        this.engine.allPlayerActivity.next(pa);
        console.log('this.playersActivity: ', this.playersActivity);
      });
    }
  }

  getRegionActivities(region: Region): RegionPlayerActivity[] {
    if(this.playersActivity) {
      return this.playersActivity.filter(pa => pa.region_id === region.id);
    }
    else return null;
  }

  
  onSelectRegion(index: number) {
    console.log('onSelectRegion: ', index);
    const allRegions: Region[] = this.engine.allRegions.getValue();
    if(allRegions) {
      const selectedRegion = allRegions.find(r => r.id === this.civilization.discovered_regions[index].id);
      if(selectedRegion) {
        console.log('selectedRegion: ', selectedRegion);
        this.selectedRegion = selectedRegion;
      }
    } else {
      console.warn('allRegions.getValue() returned null')
    }
  }

  onPartySelected(party: Party, event: Event) {
    event.stopPropagation();
    console.log('onPartySelected: ', party);
  }
  
  ngOnDestroy(): void {
    this.engine.stopEngine();
    if (this.civSubscription$)
      this.civSubscription$.unsubscribe();
    if (this.playersActivitySub$)
      this.playersActivitySub$.unsubscribe();
  }
}
