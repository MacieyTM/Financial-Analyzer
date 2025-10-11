import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
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

	protected selectedLanguage: SupportedLanguage;

	constructor(
		private readonly translateService: AppTranslateService,
		private readonly navController: NavController
	) {
		this.selectedLanguage = localStorage.getItem("selectedLang") || "en";
	}

	ngOnInit() {}

	protected changeLanguage(chosenLang: any) {
		const lang = chosenLang.detail.value;
		this.translateService.changeLanguage(lang);
		this.navController.back();
	}
}
