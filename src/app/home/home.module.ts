import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { HomePage } from "./home.page";
import { HomePageRoutingModule } from "./home-routing.module";
import { UiModule } from "../ui.module";
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from "ng2-charts";

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		HomePageRoutingModule,
		UiModule,
		BaseChartDirective,
	],
	declarations: [HomePage],
	providers: [provideCharts(withDefaultRegisterables())],
})
export class HomePageModule {}
