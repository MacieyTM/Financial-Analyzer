import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from "@angular/core";
import { PluginListenerHandle } from "@capacitor/core";
import { Network } from "@capacitor/network";
import { NavController, ToastController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { SelectOption } from "src/app/models/kpi.model";
import {
	FLAG_MAP_DATA,
	LANGUAGE_OPTIONS_DATA,
	SupportedLanguage,
} from "src/app/models/languages.model";
import { AppTranslatePipe } from "src/app/pipes/translate.pipe";
import { AppTranslateService } from "src/app/services/translate.service";

@Component({
	selector: "app-language-settings",
	templateUrl: "./language-settings.page.html",
	styleUrls: ["./language-settings.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSettingsPage implements OnInit, OnDestroy {
	protected languageOptions: SelectOption[];
	protected selectedLanguage: SupportedLanguage;
	protected networkListener: PluginListenerHandle;
	protected flagMap: Record<SupportedLanguage, string>;

	protected readonly isOnline = signal(true);

	private languageChanged: boolean;

	public constructor(
		private readonly translate: TranslateService,
		private readonly navController: NavController,
		private readonly translatePipe: AppTranslatePipe,
		private readonly toastController: ToastController,
		private readonly translateService: AppTranslateService
	) {}

	public async ngOnInit(): Promise<void> {
		this.selectedLanguage =
			localStorage.getItem("selectedLang") ||
			localStorage.getItem("deviceLanguage") ||
			localStorage.getItem("browserLanguage") ||
			this.translateService.getSystemLanguage() ||
			"en";

		if (!this.translate.getLangs().includes(this.selectedLanguage)) {
			this.selectedLanguage = "en";
		}

		this.languageOptions = LANGUAGE_OPTIONS_DATA;
		this.flagMap = FLAG_MAP_DATA;

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

	protected changeLanguage(chosenLanguage: string): void {
		const language = chosenLanguage;
		this.translateService.changeLanguage(language);
		this.languageChanged = true;
		this.navController.navigateBack("home");
	}

	protected getCurrentLanguageLabelKey(): string {
		const key = this.languageOptions.find(({ value }) => this.selectedLanguage === value)?.label;
		return key;
	}

	private async showSuccessToast(): Promise<void> {
		const toast = await this.toastController.create({
			// header: 'Success',
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
