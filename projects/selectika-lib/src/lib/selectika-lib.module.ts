import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { from } from 'rxjs';

import { CanvasComponent } from './components/canvas/canvas.component';
import { TagFeatureComponent } from './components/tag-feature/tag-feature.component';
import { RetailerSelectComponent } from './components/retailer-select/retailer-select.component';
import { TagItemCategoryComponent } from './components/tag-item-category/tag-item-category.component';

@NgModule({
  declarations: [CanvasComponent, TagFeatureComponent, RetailerSelectComponent, TagItemCategoryComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatGridListModule,
  ],
  exports: [CanvasComponent, TagFeatureComponent, RetailerSelectComponent, TagItemCategoryComponent]
})
export class SelectikaLibModule { }