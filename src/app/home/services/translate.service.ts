import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs";

const SUPPORTED_LANGUAGES = ["en", "es"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

@Injectable({
	providedIn: "root",
})
export class AppTranslateService {
	public onLangChange$ = this.translateService.onLangChange.asObservable();

	constructor(private readonly translateService: TranslateService) {
		this.translateService.addLangs(["en", "es"]);
	}

	public translate(
		_: string,
		translationKey: string,
		translationParams?: object
	): Observable<string> {
		return this.translateService.get(translationKey, translationParams);
	}

	public getSystemLanguage() {
		const [language] = window.navigator.language.split("-");
		return language;
	}
}
