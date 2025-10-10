import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ManageAccountPage } from "./manage-account.page";

const routes: Routes = [
	{
		path: "",
		component: ManageAccountPage,
	},
	{
		path: "language-settings",
		loadChildren: () =>
			import("./pages/language-settings/language-settings.module").then(
				(m) => m.LanguageSettingsPageModule
			),
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ManageAccountPageRoutingModule {}
