import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { AddKpiValuesPageRoutingModule } from "./add-kpi-values-routing.module";
import { AddKpiValuesPage } from "./add-kpi-values.page";
import { UiModule } from "src/app/ui.module";

@NgModule({
	imports: [CommonModule, FormsModule, IonicModule, AddKpiValuesPageRoutingModule, UiModule],
	declarations: [AddKpiValuesPage],
})
export class AddKpiValuesPageModule {}
