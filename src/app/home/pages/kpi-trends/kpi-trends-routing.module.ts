import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { KpiTrendsPage } from "./kpi-trends.page";

const routes: Routes = [
	{
		path: "",
		component: KpiTrendsPage,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class KpiTrendsPageRoutingModule {}
