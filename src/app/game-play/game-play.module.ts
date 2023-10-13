import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GamePlayRoutingModule } from './game-play-routing.module';
import { GamePlayComponent } from './game-play/game-play.component';


@NgModule({
  declarations: [
    GamePlayComponent
  ],
  imports: [
    CommonModule,
    GamePlayRoutingModule
  ]
})
export class GamePlayModule { }
