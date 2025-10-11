import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { UserSettingsPageRoutingModule } from "./user-settings-routing.module";
import { UserSettingsPage } from "./user-settings.page";
import { UiModule } from "src/app/ui.module";

@NgModule({
	imports: [CommonModule, FormsModule, IonicModule, UserSettingsPageRoutingModule, UiModule],
	declarations: [UserSettingsPage],
})
export class UserSettingsPageModule {}
