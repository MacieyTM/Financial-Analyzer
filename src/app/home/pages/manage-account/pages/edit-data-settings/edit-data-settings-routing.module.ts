import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EditDataSettingsPage } from "./edit-data-settings.page";

const routes: Routes = [
	{
		path: "",
		component: EditDataSettingsPage,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class EditDataSettingsPageRoutingModule {}
