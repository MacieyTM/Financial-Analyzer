import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RightPage } from './right.page';

const routes: Routes = [
  {
    path: '',
    component: RightPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RightPageRoutingModule {}
