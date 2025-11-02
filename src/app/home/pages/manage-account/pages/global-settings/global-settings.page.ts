import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";

@Component({
	selector: "app-global-settings",
	templateUrl: "./global-settings.page.html",
	styleUrls: ["./global-settings.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSettingsPage implements OnInit {
	protected kpiTypesOptions: any;

	constructor(private readonly navController: NavController) {}

	ngOnInit() {
		this.kpiTypesOptions = [
			{ value: "line", label: "Line" },
			{ value: "bar", label: "Bar" },
			{ value: "doughnut", label: "Doughnut" },
		];
	}

	protected cancel(): void {
		this.navController.back();
	}
}
