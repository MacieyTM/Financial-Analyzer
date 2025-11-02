import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { KpiTrendsPage } from "./kpi-trends.page";

const routes: Routes = [
	{
		path: "",
		component: KpiTrendsPage,
	},
	{
		path: "add-kpi-values",
		loadChildren: () =>
			import("./add-kpi-values/add-kpi-values.module").then((m) => m.AddKpiValuesPageModule),
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class KpiTrendsPageRoutingModule {}
