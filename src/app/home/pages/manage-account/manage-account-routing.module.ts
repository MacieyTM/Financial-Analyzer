import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ManageAccountPage } from "./manage-account.page";

const routes: Routes = [
	{
		path: "",
		component: ManageAccountPage,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ManageAccountPageRoutingModule {}
