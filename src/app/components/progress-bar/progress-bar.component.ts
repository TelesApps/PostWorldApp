import { Component, Input } from '@angular/core';
import { OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {

  @Input() value: number = 20;
  @Input() valueType: 'percent' = 'percent';
  @Input() color: string = 'primary';
  @Input() mode: any = 'determinate';
  @Input() bufferValue: number = 50;
  @Input() class: string = '20px';

  @Input() textColor = 'var(--primary-contrast-main)';
  @Input() text: string = '';
  @Input() textType: 'percent' | 'text' = 'text';

  multiplier = 1;

  constructor() {
  }

  ngOnInit(): void {
    if (!this.text) {
      if (this.value) {
        this.textType = 'percent';
        this.text = this.value.toString();
      }
      else {
        this.text = '0';
      }
    }
    if (this.valueType === 'percent') {
      this.multiplier = 100;
    }
  }

}
