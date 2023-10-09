import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { Tile } from 'src/app/interfaces/hex-tile.interface';
import { Player } from 'src/app/interfaces/player.interface';
import { GameWorld } from 'src/app/interfaces/world.interface';
import { AuthService } from 'src/app/services/auth.service';
import { GameCreationService } from 'src/app/services/game-creation.service';
import { HexCreationService } from 'src/app/services/hex-creation.service';
import { NeonDataService } from 'src/app/services/neon-data.service';
import { SupabaseService } from 'src/app/services/supabase.service';

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

  player: Player;
  world: GameWorld;

  constructor(private GC: GameCreationService, private auth: AuthService, private neon: NeonDataService, private SB: SupabaseService) { }


  ngOnInit() {
    // this.onCreateGame()
    this.auth.getPlayer().then(player => { this.player = player; });
  }

  onCreateGame() {

    // this.SB.getAllTerrainTypes().then((data) => {
    //   console.log('data from Supabase', data);
    // });


    // this.neon.getData().subscribe((data: any) => {
    //   console.log('got data from http call');
    //   console.log(data);
    // });


    if (this.player) {
      this.GC.createWorld(this.player.playerId, this.mapSize, this.mapType, this.seaLvl,
        this.hillLvl, this.forestry, this.temperature, this.rainfall).then((world) => {
          this.world = world;
          console.log(this.world);
        });

    } else {
      console.error('No player logged in');
    }
    // this.hexWorld = this.HX.createWorld(this.mapSize, this.mapType, this.seaLvl);
  }


}
