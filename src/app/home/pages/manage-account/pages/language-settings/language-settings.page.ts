import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from "@angular/core";
import { Network } from "@capacitor/network";
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
	protected networkListener: any;
	protected languageOptions: any;
	protected readonly isOnline = signal(true);
	protected selectedLanguage: SupportedLanguage;
	protected flagMap: Record<SupportedLanguage, string>;

	private languageChanged: boolean;

	public constructor(
		private readonly translateService: AppTranslateService,
		private readonly navController: NavController,
		private readonly toastController: ToastController,
		private readonly translatePipe: AppTranslatePipe
	) {}

	public async ngOnInit(): Promise<void> {
		this.selectedLanguage = localStorage.getItem("selectedLang") || "en";
		this.languageOptions = this.getLanguageOptionsData();
		this.flagMap = this.getFlagMapData();

		const currentStatus = await Network.getStatus();
		this.isOnline.set(currentStatus.connected);

		this.networkListener = await Network.addListener("networkStatusChange", (status) => {
			this.isOnline.set(status.connected);
		});

		this.languageChanged = false;
	}

	public ngOnDestroy(): void {
		if (this.networkListener) {
			this.networkListener.remove();
		}

		if (this.languageChanged) {
			this.showSuccessToast();
		}
	}

	protected changeLanguage(chosenLanguage: any): void {
		const language = chosenLanguage;
		this.translateService.changeLanguage(language);
		this.languageChanged = true;
		this.navController.back();
	}

	protected getCurrentLanguageLabelKey(): string {
		const key = this.languageOptions.find(({ value }) => this.selectedLanguage === value)?.label;
		return key;
	}

	private getLanguageOptionsData(): any {
		return [
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
	}

	private getFlagMapData(): Record<SupportedLanguage, string> {
		return {
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
}
