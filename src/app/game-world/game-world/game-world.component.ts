import { Component, OnDestroy, OnInit, WritableSignal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { skip, take, Subscription, BehaviorSubject, ReplaySubject } from 'rxjs';
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
import { LibraryDataService } from 'src/app/services/library-data.service';
import { Colonist } from 'src/app/interfaces/colonist.interface';

@Component({
  selector: 'app-game-world',
  templateUrl: './game-world.component.html',
  styleUrls: ['./game-world.component.scss']
})

export class GameWorldComponent implements OnInit, OnDestroy {

  civilization: Civilization
  civSubscription$: Subscription;
  selectedSubscription$: Subscription;
  allColonistsSubscription$: Subscription;
  allPlayersActivity: RegionPlayerActivity[];

  playersActivitySub$: Subscription;
  selectedRegion: Region;
  selectedParty: Party;
  gametime = 0
  progressValue = 40;

  allPlayerColonists: WritableSignal<Colonist[]> = signal<Colonist[]>([]);

  constructor(
    private auth: AuthService,
    public engine: EngineService,
    private firebase: FirebaseService,
    private supabase: LibraryDataService,
    public storage: StorageService) { }

  ngOnInit(): void {
    console.warn('Game World Component');
    this.loadGameState();
  }

  async loadGameState() {
    let player: Player = await this.auth.getPlayer();
    this.civSubscription$ = this.engine.getCivilization().subscribe(civ => {
      this.civilization = civ;
      this.gametime++;
    });
    this.playersActivitySub$ = this.engine.getAllPlayerActivity().subscribe(pa => {
      console.log('pa: ', pa);
      this.allPlayersActivity = pa;
    });
    this.firebase.getAllColonists("claudioteles85@gmail.com_1705161982853").then(colonists => {
      console.log('colonists: ', colonists);
      this.allPlayerColonists.set(colonists);
    });
    

    this.testDevelopment();
  }

  testDevelopment() {
    // Use this function to load game durring development
    if (!this.civilization) {
      this.firebase.getCivilizationWithId('f53ad276-302a-4816-92bf-591bc52bc4b3').then(civ => {
        this.civilization = civ;
        console.log('this.civilization: ', this.civilization);
      });
    }
    if (!this.allPlayersActivity) {
      this.firebase.getAllPlayerActivity("claudioteles85@gmail.com_1705161982853").then(pa => {
        // this.engine.updateAllPlayerActivity(pa);
        this.engine.testNextAllPlayerActivity(pa);
        console.log('this.playersActivity: ', this.allPlayersActivity);
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
    if (this.allPlayersActivity) {
      return this.allPlayersActivity.filter(pa => pa.region_id === region.id);
    }
    else return null;
  }

  getPartyActivities() {
    if (this.selectedParty) {
      const playerActivity = this.allPlayersActivity.find(pa => pa.civilization_id === this.civilization.id);
      const party = playerActivity.parties.find(p => p.id === this.selectedParty.id);
      this.selectedParty = party;
      return party;
    }
    return null;
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

  onPartyExplore(party: Party) {
    if(this.engine.isNoEngineMode) {
      // reveal another region
      
      
      return;
    }


    const playerActivity = this.allPlayersActivity.find(pa => pa.civilization_id === this.civilization.id);
    // const partyActivity = playerActivity.parties.find(p => p.id === party.id);
    if (party.activity === 'exploring') {
      party.activity = 'idle';
    } else party.activity = 'exploring';
    party.activity_progress = playerActivity.explored_percent;
    console.log('this.allPlayersActivity: ', this.allPlayersActivity);
    this.engine.updateAllPlayerActivity(this.allPlayersActivity);
  }

  getRegionExploredValue(): number {
    const activities = this.getRegionActivities(this.selectedRegion);
    if (!activities) return 0;
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
