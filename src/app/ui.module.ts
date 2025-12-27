import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateDirective } from "./directives/translate.directive";
import { AppTranslatePipe } from "./pipes/translate.pipe";
import { TranslatePipe } from "@ngx-translate/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { MatDialogModule } from "@angular/material/dialog";
import { HomeHeaderComponent } from "./components/home-header/home-header.component";
import { HomeFooterComponent } from "./components/home-footer/home-footer.component";
import { TermsAndConditionsComponent } from "./components/terms-and-condtions/terms-and-conditions.component";

const PIPES = [AppTranslatePipe];
const DIRECTIVES = [TranslateDirective];

@NgModule({
	declarations: [
		HomeHeaderComponent,
		HomeFooterComponent,
		TermsAndConditionsComponent,
		...PIPES,
		...DIRECTIVES,
	],
	exports: [
		MatFormFieldModule,
		MatSelectModule,
		MatIconModule,
		MatDividerModule,
		HomeHeaderComponent,
		HomeFooterComponent,
		TermsAndConditionsComponent,
		...PIPES,
		...DIRECTIVES,
	],
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatSelectModule,
		MatIconModule,
		MatDividerModule,
		MatDialogModule,
	],
	providers: [TranslatePipe, AppTranslatePipe],
})
export class UiModule {}
