import { Pipe, PipeTransform } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";

@Pipe({
	name: "appTranslate",
})
export class AppTranslatePipe implements PipeTransform {
	constructor(private readonly translatePipe: TranslatePipe) {}

	transform(_: string, translationKey: string, args?: object): string {
		return this.translatePipe.transform(translationKey, args);
	}
}
