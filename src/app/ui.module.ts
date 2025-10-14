import { NgModule } from "@angular/core";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateDirective } from "./directives/translate.directive";
import { AppTranslatePipe } from "./pipes/translate.pipe";
import { TranslatePipe } from "@ngx-translate/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";

const PIPES = [AppTranslatePipe];
const DIRECTIVES = [TranslateDirective];

@NgModule({
	declarations: [...PIPES, ...DIRECTIVES],
	exports: [
		MatFormFieldModule,
		MatSelectModule,
		MatIconModule,
		MatDividerModule,
		NgOptimizedImage,
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
		NgOptimizedImage,
	],
	providers: [TranslatePipe, AppTranslatePipe],
})
export class UiModule {}
