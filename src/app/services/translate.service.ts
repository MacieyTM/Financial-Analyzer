import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs";
import { SUPPORTED_LANGUAGES, SupportedLanguage } from "../models/languages.model";

@Injectable({
	providedIn: "root",
})
export class AppTranslateService {
	public constructor(private readonly translateService: TranslateService) {
		this.translateService.addLangs(SUPPORTED_LANGUAGES);

		// const savedLanguage: SupportedLanguage =
		// 	localStorage.getItem("selectedLang") ||
		// 	localStorage.getItem("deviceLanguage") ||
		// 	localStorage.getItem("browserLanguage") ||
		// 	this.getSystemLanguage() ||
		// 	"en";

		const savedLanguage: SupportedLanguage = localStorage.getItem("selectedLang") || "en";

		if (!this.translateService.getLangs().includes(savedLanguage)) {
			this.translateService.use("en");
			return;
		}

		this.translateService.use(savedLanguage);
	}

	protected translate(
		_: string,
		translationKey: string,
		translationParams?: object
	): Observable<string> {
		return this.translateService.get(translationKey, translationParams);
	}

	public getSystemLanguage(): string {
		const [language] = window.navigator.language.split("-");
		return language;
	}

	public changeLanguage(supportedLanguage: SupportedLanguage): void {
		this.translateService.use(supportedLanguage);
		localStorage.setItem("selectedLang", supportedLanguage);
	}
}
