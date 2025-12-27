import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { EditDataSettingsPageRoutingModule } from "./edit-data-settings-routing.module";
import { EditDataSettingsPage } from "./edit-data-settings.page";
import { UiModule } from "src/app/ui.module";

@NgModule({
	imports: [CommonModule, FormsModule, IonicModule, EditDataSettingsPageRoutingModule, UiModule],
	declarations: [EditDataSettingsPage],
})
export class EditDataSettingsPageModule {}
