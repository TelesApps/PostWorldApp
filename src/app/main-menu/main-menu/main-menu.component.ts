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
import { EngineService } from 'src/app/services/engine.service';
import { Region } from 'src/app/interfaces/regions.interface';

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
  savedGames: GameWorld[];

  constructor(
    private GC: GameCreationService,
    private auth: AuthService,
    private firebase: FirebaseService,
    private router: Router,
    private engine: EngineService) { }


  ngOnInit() {
    // this.onCreateGame()
    this.auth.getPlayer().then(player => {
      this.player = player;
      this.onLoadSaveGames(player.player_id);
    });
  }

  onLoadSaveGames(playerId: string) {
    this.firebase.getSavedGames(playerId).then((savedGames) => {
      this.savedGames = savedGames;
    });
  }

  onCreateGame() {
    if (this.player) {
      this.GC.createWorld(this.player, this.mapSize, this.mapType, this.seaLvl,
        this.hillLvl, this.forestry, this.temperature, this.rainfall).then((world) => {
          this.world = world;
          console.log('game world created', this.world);
          this.firebase.saveGame(world).then(() => {
            this.onLoadGame(world);
          });
        });

    } else {
      console.error('No player logged in');
    }
  }


  async onLoadGame(gameWorld: GameWorld) {
    // get all of the collections from firebase to pass it to engine
    const allContinents = await this.firebase.getAllContinents(gameWorld.id);
    const allRegions = await this.firebase.getAllRegions(gameWorld.id);
    const allParties = await this.firebase.getAllParties(gameWorld.id);
    const allPlayerActivity = await this.firebase.getAllPlayerActivity(gameWorld.id);
    const allBuildings = await this.firebase.getAllBuildings(gameWorld.id);
    const allColonists = await this.firebase.getAllColonists(gameWorld.id);

    this.engine.startEngine(gameWorld, allContinents, allRegions, allParties, allPlayerActivity, allBuildings, allColonists);
    this.router.navigate(['/game-world']);

    // this.firebase.loadGame(game.id).then((world) => {
    //   this.world = world;
    //   console.log('game world loaded', this.world);
    //   this.engine.startEngine(world);
    // });
  }

  onDeleteGame(game: GameWorld) {
    this.firebase.deleteGame(game.id).then(() => {
      console.log('game deleted');
      this.auth.getPlayer().then(player => {
        this.player = player;
        this.onLoadSaveGames(player.player_id);
      });
    });
  }


}
