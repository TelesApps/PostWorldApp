import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameWorldRoutingModule } from './game-world-routing.module';
import { GameWorldComponent } from './game-world/game-world.component';
import { RegionComponent } from './region/region.component';


@NgModule({
  declarations: [
    GameWorldComponent,
    RegionComponent,
  ],
  imports: [
    CommonModule,
    GameWorldRoutingModule
  ]
})
export class GameWorldModule { }
