import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { KpiTrendsPageRoutingModule } from "./kpi-trends-routing.module";
import { KpiTrendsPage } from "./kpi-trends.page";
import { UiModule } from "src/app/ui.module";
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from "ng2-charts";

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		KpiTrendsPageRoutingModule,
		UiModule,
		BaseChartDirective,
	],
	declarations: [KpiTrendsPage],
	providers: [provideCharts(withDefaultRegisterables())],
})
export class KpiTrendsPageModule {}
