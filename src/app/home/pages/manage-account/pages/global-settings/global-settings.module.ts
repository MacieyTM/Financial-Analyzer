import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { GlobalSettingsPageRoutingModule } from "./global-settings-routing.module";
import { GlobalSettingsPage } from "./global-settings.page";
import { UiModule } from "src/app/ui.module";

@NgModule({
	imports: [CommonModule, FormsModule, IonicModule, GlobalSettingsPageRoutingModule, UiModule],
	declarations: [GlobalSettingsPage],
})
export class GlobalSettingsPageModule {}
