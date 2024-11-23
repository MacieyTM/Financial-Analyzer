import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RightPageRoutingModule } from './right-routing.module';

import { RightPage } from './right.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RightPageRoutingModule
  ],
  declarations: [RightPage]
})
export class RightPageModule {}
