import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { ResourceUiComponent } from '../resource-ui/resource-ui.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BrowserModule } from '@angular/platform-browser';



@NgModule({
  declarations: [ProgressBarComponent, ResourceUiComponent],
  imports: [
    CommonModule,
    MatProgressBarModule,
  ],
  exports: [ProgressBarComponent, ResourceUiComponent]
})
export class SharedComponentsModule { }
