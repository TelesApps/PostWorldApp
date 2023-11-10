import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { ResourceUiComponent } from '../resource-ui/resource-ui.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';



@NgModule({
  declarations: [ProgressBarComponent, ResourceUiComponent],
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatTooltipModule
  ],
  exports: [ProgressBarComponent, ResourceUiComponent]
})
export class SharedComponentsModule { }
