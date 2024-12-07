import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomePage } from "./home.page";

const routes: Routes = [
	{
		path: "",
		component: HomePage,
	},
	{
		path: "manage-account",
		loadChildren: () =>
			import("./pages/manage-account/manage-account.module").then((m) => m.ManageAccountPageModule),
	},
	{
		path: "kpi-trends",
		loadChildren: () =>
			import("./pages/kpi-trends/kpi-trends.module").then((m) => m.KpiTrendsPageModule),
	},
	{
		path: "left",
		loadChildren: () => import("./pages/left/left.module").then((m) => m.LeftPageModule),
	},
	{
		path: "right",
		loadChildren: () => import("./pages/right/right.module").then((m) => m.RightPageModule),
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class HomePageRoutingModule {}
