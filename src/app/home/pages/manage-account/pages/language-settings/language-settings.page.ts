import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { AppTranslateService, SupportedLanguage } from "src/app/services/translate.service";

@Component({
	selector: "app-language-settings",
	templateUrl: "./language-settings.page.html",
	styleUrls: ["./language-settings.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSettingsPage implements OnInit {
	protected languageOptions = [
		{ value: "en", label: "english" },
		{ value: "pl", label: "polish" },
	];

	protected selectedLanguage: string;

	constructor(private readonly translateService: AppTranslateService) {
		this.selectedLanguage = localStorage.getItem("selectedLang") || "en";
	}

	ngOnInit() {}

	ngOnChanges() {
		this.languageOptions = JSON.parse(JSON.stringify(this.languageOptions));
	}

	protected changeLanguage(event: any) {
		const lang = event.detail.value;
		this.translateService.changeLanguage(lang);
	}

	protected getCurrentLanguageLabelKey(): string {
		const key = this.languageOptions.find(({ value }) => this.selectedLanguage === value)?.label;
		return key ?? "";
	}
}
