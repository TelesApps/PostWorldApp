import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { skip, take, Subscription } from 'rxjs';
import { Civilization } from 'src/app/interfaces/civilization.interface';
import { GameWorld } from 'src/app/interfaces/game-world.interface';
import { Player } from 'src/app/interfaces/player.interface';
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
  gametime = 0

  constructor(private auth: AuthService, public engine: EngineService, private firebase: FirebaseService) { }

  ngOnInit(): void {
    this.loadGameState();
  }

  async loadGameState() {
    let player: Player = await this.auth.getPlayer();
    this.civSubscription$ = this.engine.civilization.subscribe(civ => {
      this.civilization = civ;
      this.gametime++
    });
    // Use this function to load game durring development
    if(!this.civilization) {
      this.firebase.getCivilizationWithId('93213836-acf2-4ed4-8578-58e4af6a04c8').then(civ => {
        this.civilization = civ;
        console.log('this.civilization: ', this.civilization);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.civSubscription$)
      this.civSubscription$.unsubscribe();
  }

  onSelectRegion(index: number) {
    console.log('onSelectRegion: ', index);
  }

}
