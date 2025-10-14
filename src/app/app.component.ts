import { Component } from "@angular/core";
import { ScreenOrientation, OrientationType } from "@capawesome/capacitor-screen-orientation";
import { Platform } from "@ionic/angular";
import { Capacitor } from "@capacitor/core";

@Component({
	selector: "app-root",
	templateUrl: "app.component.html",
	styleUrls: ["app.component.scss"],
})
export class AppComponent {
	constructor(private readonly platform: Platform) {}

	public async ngOnInit(): Promise<void> {
		await this.platform.ready();

		if (Capacitor.getPlatform() !== "web") {
			await ScreenOrientation.lock({ type: OrientationType.PORTRAIT });
		}
		// if (this.platform.is("android") || this.platform.is("ios")) {
		// 	await ScreenOrientation.lock({ type: OrientationType.PORTRAIT });
		// }
	}
}
