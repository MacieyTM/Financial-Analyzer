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
	{
		path: "user-settings",
		loadChildren: () =>
			import("./pages/user-settings/user-settings.module").then((m) => m.UserSettingsPageModule),
	},
	{
		path: "global-settings",
		loadChildren: () =>
			import("./pages/global-settings/global-settings.module").then(
				(m) => m.GlobalSettingsPageModule
			),
	},
	{
		path: "data-settings",
		loadChildren: () =>
			import("./pages/data-settings/data-settings.module").then((m) => m.DataSettingsPageModule),
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ManageAccountPageRoutingModule {}
