import { Component } from "@angular/core";
import { ScreenOrientation, OrientationType } from "@capawesome/capacitor-screen-orientation";
import { Platform } from "@ionic/angular";
import { Capacitor } from "@capacitor/core";
import { MatDialog } from "@angular/material/dialog";
import { TermsAndConditionsComponent } from "./components/terms-and-condtions/terms-and-conditions.component";
import { Device } from "@capacitor/device";
import { SupportedLanguage } from "./models/languages.model";

@Component({
	selector: "app-root",
	templateUrl: "app.component.html",
	styleUrls: ["app.component.scss"],
})
export class AppComponent {
	private deviceLanguage: SupportedLanguage;
	private browserLanguage: SupportedLanguage;

	constructor(private readonly platform: Platform, private readonly dialog: MatDialog) {
		const dark = localStorage.getItem("darkMode") === "true";
		document.body.classList.toggle("dark", dark);
	}

	public async ngOnInit(): Promise<void> {
		await this.platform.ready();

		// if (this.platform.is("android") || this.platform.is("ios")) {
		// 	await ScreenOrientation.lock({ type: OrientationType.PORTRAIT });
		// }

		if (Capacitor.getPlatform() !== "web") {
			const info = await Device.getLanguageCode();
			this.deviceLanguage = info.value as SupportedLanguage;

			localStorage.setItem("deviceLanguage", this.deviceLanguage);
			await ScreenOrientation.lock({ type: OrientationType.PORTRAIT });
		} else {
			this.browserLanguage =
				(navigator.language.split("-")[0] as SupportedLanguage) ||
				((navigator.languages && navigator.languages[0]).split("-")[0] as SupportedLanguage) ||
				"en";

			localStorage.setItem("browserLanguage", this.browserLanguage);
		}

		const isFirstLaunch = localStorage.getItem("firstLaunchDone");
		if (!isFirstLaunch) {
			this.dialog.open(TermsAndConditionsComponent, {
				width: "90vw",
				disableClose: true,
			});
		}
	}
}
