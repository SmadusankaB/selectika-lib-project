import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasComponent } from './components/canvas/canvas.component';
import { from } from 'rxjs';



@NgModule({
  declarations: [CanvasComponent],
  imports: [
    CommonModule
  ],
  exports: [CanvasComponent]
})
export class SelectikaLibModule { }