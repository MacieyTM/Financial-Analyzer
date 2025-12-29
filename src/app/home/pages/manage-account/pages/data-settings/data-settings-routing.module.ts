import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DataSettingsPage } from "./data-settings.page";

const routes: Routes = [
	{
		path: "",
		component: DataSettingsPage,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class DataSettingsPageRoutingModule {}
