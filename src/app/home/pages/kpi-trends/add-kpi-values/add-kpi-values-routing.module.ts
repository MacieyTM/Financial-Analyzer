import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AddKpiValuesPage } from "./add-kpi-values.page";

const routes: Routes = [
	{
		path: "",
		component: AddKpiValuesPage,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AddKpiValuesPageRoutingModule {}
