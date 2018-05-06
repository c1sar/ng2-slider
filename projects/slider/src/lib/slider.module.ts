import { NgModule } from '@angular/core';
import { SliderComponent } from './slider.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SliderComponent],
  exports: [SliderComponent]
})
export class SliderModule { }
