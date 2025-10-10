import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { ManageAccountPageRoutingModule } from "./manage-account-routing.module";
import { ManageAccountPage } from "./manage-account.page";
import { UiModule } from "src/app/ui.module";

@NgModule({
	imports: [CommonModule, FormsModule, IonicModule, ManageAccountPageRoutingModule, UiModule],
	declarations: [ManageAccountPage],
})
export class ManageAccountPageModule {}
