import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ScreenOrientation, OrientationType } from "@capawesome/capacitor-screen-orientation";
import { Platform } from "@ionic/angular";
// import { Capacitor } from "@capacitor/core";

@Component({
	selector: "app-root",
	templateUrl: "app.component.html",
	styleUrls: ["app.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
	constructor(private readonly platform: Platform) {
		if (this.platform.is("android") || this.platform.is("ios")) {
			ScreenOrientation.lock({ type: OrientationType.PORTRAIT });
		}
		// if (Capacitor.getPlatform() !== "web") {
		// 	ScreenOrientation.lock({ type: OrientationType.PORTRAIT });
		// }
	}
}
