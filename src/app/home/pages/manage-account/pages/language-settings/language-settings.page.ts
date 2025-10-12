import { ChangeDetectionStrategy, Component, OnChanges, OnDestroy, OnInit } from "@angular/core";
import { NavController, ToastController } from "@ionic/angular";
import { AppTranslatePipe } from "src/app/pipes/translate.pipe";
import { AppTranslateService, SupportedLanguage } from "src/app/services/translate.service";

@Component({
	selector: "app-language-settings",
	templateUrl: "./language-settings.page.html",
	styleUrls: ["./language-settings.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSettingsPage implements OnInit, OnChanges, OnDestroy {
	protected selectedLanguage: SupportedLanguage;
	protected languageOptions = [
		{ value: "en", label: "english" },
		{ value: "pl", label: "polish" },
		{ value: "de", label: "german" },
		{ value: "fr", label: "french" },
		{ value: "it", label: "italian" },
		{ value: "es", label: "spanish" },
		{ value: "zh", label: "chinese" },
		{ value: "hi", label: "hindi" },
		{ value: "pt", label: "portuguese" },
		{ value: "ru", label: "russian" },
		{ value: "ja", label: "japanese" },
		{ value: "ko", label: "korean" },
		{ value: "tr", label: "turkish" },
		{ value: "uk", label: "ukrainian" },
	];

	private languageChanged!: boolean;

	constructor(
		private readonly translateService: AppTranslateService,
		private readonly navController: NavController,
		private readonly toastController: ToastController,
		private readonly translatePipe: AppTranslatePipe
	) {
		this.selectedLanguage = localStorage.getItem("selectedLang") || "en";
	}

	ngOnInit() {
		this.languageChanged = false;
	}

	ngOnChanges() {
		this.languageOptions = JSON.parse(JSON.stringify(this.languageOptions));
	}

	protected changeLanguage(chosenLang: any) {
		const lang = chosenLang.detail.value;
		this.translateService.changeLanguage(lang);
		this.languageChanged = true;
		this.navController.back();
	}

	protected getCurrentLanguageLabelKey(): string | undefined {
		const key = this.languageOptions.find(({ value }) => this.selectedLanguage === value)?.label;
		return key;
	}

	private async showSuccessToast(): Promise<void> {
		const toast = await this.toastController.create({
			message: this.translatePipe.transform(
				"Language changed successfully!",
				"language_changed_successfully"
			),
			duration: 3000,
			position: "bottom",
			color: "success",
			icon: "checkmark-circle",
		});
		toast.present();
	}

	ngOnDestroy() {
		if (this.languageChanged) {
			this.showSuccessToast();
		}
	}
}
