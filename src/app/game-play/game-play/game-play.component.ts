import { Component, OnInit } from '@angular/core';
import { EngineService } from 'src/app/services/engine.service';

@Component({
  selector: 'app-game-play',
  templateUrl: './game-play.component.html',
  styleUrls: ['./game-play.component.scss']
})

export class GamePlayComponent implements OnInit {
  
    constructor(private engine: EngineService) { }
  
    ngOnInit(): void {
    }

}
