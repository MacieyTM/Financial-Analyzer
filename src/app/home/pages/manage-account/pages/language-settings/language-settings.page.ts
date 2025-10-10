import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { AppTranslateService } from "src/app/services/translate.service";

@Component({
	selector: "app-language-settings",
	templateUrl: "./language-settings.page.html",
	styleUrls: ["./language-settings.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSettingsPage implements OnInit {
	protected readonly options = [
		{ value: "en", label: "English" },
		{ value: "pl", label: "Polish" },
	];

	protected selectedLanguage: string;

	constructor(private readonly translateService: AppTranslateService) {
		this.selectedLanguage = localStorage.getItem("selectedLang") || "en";
	}

	ngOnInit() {}

	protected changeLanguage(event: any) {
		const lang = event.detail.value;
		this.translateService.changeLanguage(lang);
	}
}
