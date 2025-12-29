import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { DataSettingsPageRoutingModule } from "./data-settings-routing.module";
import { DataSettingsPage } from "./data-settings.page";
import { UiModule } from "src/app/ui.module";

@NgModule({
	imports: [CommonModule, FormsModule, IonicModule, DataSettingsPageRoutingModule, UiModule],
	declarations: [DataSettingsPage],
})
export class DataSettingsPageModule {}
