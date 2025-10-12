import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { Network } from "@capacitor/network";
import { NavController, ToastController } from "@ionic/angular";
import { AppTranslatePipe } from "src/app/pipes/translate.pipe";
import { AppTranslateService, SupportedLanguage } from "src/app/services/translate.service";

const LANGUAGE_OPTIONS_DATA = [
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

const FLAG_MAP_DATA = {
	en: "US",
	pl: "PL",
	de: "DE",
	fr: "FR",
	it: "IT",
	es: "ES",
	zh: "CN",
	hi: "IN",
	pt: "PT",
	ru: "RU",
	ja: "JP",
	ko: "KR",
	tr: "TR",
	uk: "UA",
};

@Component({
	selector: "app-language-settings",
	templateUrl: "./language-settings.page.html",
	styleUrls: ["./language-settings.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSettingsPage implements OnInit, OnDestroy {
	public networkListener: any;
	public isOnline = true;

	protected selectedLanguage: SupportedLanguage;
	protected languageOptions = LANGUAGE_OPTIONS_DATA;
	protected flagMap: Record<SupportedLanguage, string> = FLAG_MAP_DATA;

	private languageChanged!: boolean;

	constructor(
		private readonly translateService: AppTranslateService,
		private readonly navController: NavController,
		private readonly toastController: ToastController,
		private readonly translatePipe: AppTranslatePipe
	) {
		this.selectedLanguage = localStorage.getItem("selectedLang") || "en";
	}

	async ngOnInit() {
		const status = await Network.getStatus();
		this.isOnline = status.connected;

		this.networkListener = Network.addListener("networkStatusChange", (status) => {
			this.isOnline = status.connected;
		});

		this.languageChanged = false;
	}

	protected changeLanguage(chosenLang: any) {
		const lang = chosenLang;
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
			color: "success",
			icon: "checkmark-circle",
		});
		toast.present();
	}

	ngOnDestroy() {
		if (this.networkListener) {
			this.networkListener.remove();
		}

		if (this.languageChanged) {
			this.showSuccessToast();
		}
	}
}
