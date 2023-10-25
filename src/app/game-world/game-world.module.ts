import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameWorldRoutingModule } from './game-world-routing.module';
import { GameWorldComponent } from './game-world/game-world.component';
import { RegionComponent } from './region/region.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProgressBarComponent } from '../components/progress-bar/progress-bar.component';
import { SharedComponentsModule } from '../components/shared-components/shared-components.module';


@NgModule({
  declarations: [
    GameWorldComponent,
    RegionComponent,
  ],
  imports: [
    CommonModule,
    GameWorldRoutingModule,
    MatIconModule,
    MatButtonModule,
    SharedComponentsModule,
  ]
})
export class GameWorldModule { }
