import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent {

  @Input() value: number = 20;
  @Input() color: string = 'primary';
  @Input() mode: any = 'determinate';
  @Input() bufferValue: number = 50;
  @Input() class: string = '20px';

}
