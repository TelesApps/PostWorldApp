import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameWorldComponent } from './game-world/game-world.component';
import { RegionComponent } from './region/region.component';

const routes: Routes = [
  {
    path: '',
    component: GameWorldComponent,   
  },
  {
    path: ':id',
    component: RegionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameWorldRoutingModule { }
