import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ProductComponent } from './product/product.component';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { FilterPipe } from '../pipes/filter.pipe';

import { Tab1PageRoutingModule } from './tab1-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule
  ],
  declarations: [Tab1Page, FilterPipe, ProductComponent]
})
export class Tab1PageModule {}
