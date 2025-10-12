import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs";

const SUPPORTED_LANGUAGES = [
	"en",
	"pl",
	"de",
	"fr",
	"it",
	"es",
	"zh",
	"hi",
	"pt",
	"ru",
	"ja",
	"ko",
	"tr",
	"uk",
];

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

@Injectable({
	providedIn: "root",
})
export class AppTranslateService {
	constructor(private readonly translateService: TranslateService) {
		this.translateService.addLangs(SUPPORTED_LANGUAGES);
		const savedLanguage = localStorage.getItem("selectedLang") || "en";
		this.translateService.use(savedLanguage);
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

	public changeLanguage(supportedLanguage: SupportedLanguage) {
		this.translateService.use(supportedLanguage);
		localStorage.setItem("selectedLang", supportedLanguage);
	}
}
