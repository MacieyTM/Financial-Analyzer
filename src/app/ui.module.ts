import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateDirective } from "./directives/translate.directive";
import { AppTranslatePipe } from "./pipes/translate.pipe";
import { TranslatePipe } from "@ngx-translate/core";

const PIPES = [AppTranslatePipe];
const DIRECTIVES = [TranslateDirective];

@NgModule({
	declarations: [...PIPES, ...DIRECTIVES],
	exports: [...PIPES, ...DIRECTIVES],
	imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
	providers: [TranslatePipe, AppTranslatePipe],
})
export class UiModule {}
