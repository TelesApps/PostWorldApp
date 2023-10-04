import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { Tile } from 'src/app/interfaces/hex-tile.interface';
import { GameWorld } from 'src/app/interfaces/world.interface';
import { GameCreationService } from 'src/app/services/game-creation.service';
import { HexCreationService } from 'src/app/services/hex-creation.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {

  mapSize: string = 'medium';
  mapType: string = 'continents';
  seaLvl: string = 'medium';
  hillLvl: string = 'average';
  forestry: string = 'medium';
  temperature: string = 'temperate';
  rainfall: string = 'average';

  world: GameWorld;
  // hexWorld: Tile[][];

  constructor(private GC: GameCreationService, private HX: HexCreationService) { }


  ngOnInit() {
    // this.onCreateGame()
  }

  onCreateGame() {
    this.GC.createWorld(this.mapSize, this.mapType, this.seaLvl,
      this.hillLvl, this.forestry, this.temperature, this.rainfall).pipe(take(1)).subscribe(world => {
        this.world = world;
        console.log(this.world);
        // console.log(JSON.stringify(this.world));
      });
    // this.hexWorld = this.HX.createWorld(this.mapSize, this.mapType, this.seaLvl);
  }


}
