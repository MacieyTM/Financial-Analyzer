import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { NavController, ToastController } from "@ionic/angular";
import { CHART_TYPES } from "src/app/models/chart.model";

@Component({
	selector: "app-global-settings",
	templateUrl: "./global-settings.page.html",
	styleUrls: ["./global-settings.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSettingsPage implements OnInit, OnDestroy {
	protected kpiTypesOptions: any;
	protected selectedKpiType = "";
	protected hasChanges = false;

	private originalChartType: string;
	private chartTypeChanged: boolean;

	constructor(
		private readonly navController: NavController,
		private readonly toastController: ToastController
	) {}

	ngOnInit() {
		const storedKpiType = localStorage.getItem("selectedKpiType");

		this.kpiTypesOptions = CHART_TYPES;
		this.originalChartType = storedKpiType ?? this.kpiTypesOptions[0].value;
		this.selectedKpiType = this.originalChartType;

		this.chartTypeChanged = false;
	}

	public ngOnDestroy(): void {
		if (this.chartTypeChanged) {
			this.showSuccessToast();
		}
	}

	protected cancel(): void {
		this.navController.back();
	}

	protected changeKpiType(event: any): void {
		this.selectedKpiType = event.detail.value;
		this.hasChanges = this.selectedKpiType !== this.originalChartType;
	}

	protected save(): void {
		localStorage.setItem("selectedKpiType", this.selectedKpiType);
		this.chartTypeChanged = true;
		this.navController.navigateBack("home");
	}

	private async showSuccessToast(): Promise<void> {
		const toast = await this.toastController.create({
			message: "Chart type changed successfully!",
			duration: 3000,
			color: "success",
			icon: "checkmark-circle",
		});
		toast.present();
	}
}
