import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { NavController, ToastController } from "@ionic/angular";
import { AppTranslatePipe } from "src/app/pipes/translate.pipe";
import { AppTranslateService, SupportedLanguage } from "src/app/services/translate.service";

@Component({
	selector: "app-language-settings",
	templateUrl: "./language-settings.page.html",
	styleUrls: ["./language-settings.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSettingsPage implements OnInit, OnDestroy {
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

	protected changeLanguage(chosenLang: any) {
		const lang = chosenLang.detail.value;
		this.translateService.changeLanguage(lang);
		this.languageChanged = true;
		this.navController.back();
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
