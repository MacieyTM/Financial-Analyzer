import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeftPageRoutingModule } from './left-routing.module';

import { LeftPage } from './left.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeftPageRoutingModule
  ],
  declarations: [LeftPage]
})
export class LeftPageModule {}
