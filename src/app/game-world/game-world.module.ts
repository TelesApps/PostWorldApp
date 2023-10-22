import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameWorldRoutingModule } from './game-world-routing.module';
import { GameWorldComponent } from './game-world/game-world.component';
import { RegionComponent } from './region/region.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    GameWorldComponent,
    RegionComponent,
  ],
  imports: [
    CommonModule,
    GameWorldRoutingModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class GameWorldModule { }
