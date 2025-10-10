import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { KpiTrendsPageRoutingModule } from "./kpi-trends-routing.module";

import { KpiTrendsPage } from "./kpi-trends.page";
import { UiModule } from "src/app/ui.module";

@NgModule({
	imports: [CommonModule, FormsModule, IonicModule, KpiTrendsPageRoutingModule, UiModule],
	declarations: [KpiTrendsPage],
})
export class KpiTrendsPageModule {}
