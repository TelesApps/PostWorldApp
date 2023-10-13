import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { Tile } from 'src/app/interfaces/hex-tile.interface';
import { Player } from 'src/app/interfaces/player.interface';
import { GameWorld } from 'src/app/interfaces/game-world.interface';
import { AuthService } from 'src/app/services/auth.service';
import { GameCreationService } from 'src/app/services/game-creation.service';
import { HexCreationService } from 'src/app/services/hex-creation.service';
import { NeonDataService } from 'src/app/services/neon-data.service';
import { SupabaseService } from 'src/app/services/supabase.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';

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

  constructor(private GC: GameCreationService, private auth: AuthService, private firebase: FirebaseService, private router: Router) { }


  ngOnInit() {
    // this.onCreateGame()
    this.auth.getPlayer().then(player => { this.player = player; });
  }

  onCreateGame() {

    if (this.player) {
      this.GC.createWorld(this.player, this.mapSize, this.mapType, this.seaLvl,
        this.hillLvl, this.forestry, this.temperature, this.rainfall).then((world) => {
          this.world = world;
          console.log('game world created', this.world);
          this.firebase.saveGame(world).then(() => {
            this.router.navigate(['/game']);
          });
        });

    } else {
      console.error('No player logged in');
    }
  }


}
