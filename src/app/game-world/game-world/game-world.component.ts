import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameWorld } from 'src/app/interfaces/game-world.interface';
import { Player } from 'src/app/interfaces/player.interface';
import { Region, RegionPlayerActivity } from 'src/app/interfaces/regions.interface';
import { AuthService } from 'src/app/services/auth.service';
import { EngineService } from 'src/app/services/engine.service';

@Component({
  selector: 'app-game-world',
  templateUrl: './game-world.component.html',
  styleUrls: ['./game-world.component.scss']
})

export class GameWorldComponent implements OnInit {

  constructor(private auth: AuthService, private engine: EngineService, private router: Router) { }

  ngOnInit(): void {
    this.loadGameState();
  }

  async loadGameState() {
    let player: Player = await this.auth.getPlayer();
    let gameWorld: GameWorld = this.engine.gameWorld.getValue();
    if (!gameWorld) {
      console.log('No game world found, redirecting to main menu');
      this.router.navigate(['/main-menu']);
    }
    // Get the region that has the player activity
    const regions = this.engine.allRegions.getValue().filter(r => r.has_player_activity);
    console.log('regions', regions);
    const region = regions.find(r => r.player_activity.find(pa => pa.player_id === player.player_id));
    console.log('region', region);
  }

}
