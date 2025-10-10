import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { LanguageSettingsPageRoutingModule } from "./language-settings-routing.module";
import { LanguageSettingsPage } from "./language-settings.page";
import { UiModule } from "src/app/ui.module";

@NgModule({
	imports: [CommonModule, FormsModule, IonicModule, LanguageSettingsPageRoutingModule, UiModule],
	declarations: [LanguageSettingsPage],
})
export class LanguageSettingsPageModule {}
