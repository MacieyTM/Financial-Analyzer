import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeftPage } from './left.page';

const routes: Routes = [
  {
    path: '',
    component: LeftPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeftPageRoutingModule {}
