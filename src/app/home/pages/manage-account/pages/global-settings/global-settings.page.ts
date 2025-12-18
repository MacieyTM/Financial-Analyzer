import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { NavController, ToastController } from "@ionic/angular";
import { CHART_TYPES } from "src/app/models/chart.model";
import { SelectOption } from "src/app/models/kpi.model";

@Component({
	selector: "app-global-settings",
	templateUrl: "./global-settings.page.html",
	styleUrls: ["./global-settings.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSettingsPage implements OnInit, OnDestroy {
	protected hasChanges = false;
	protected kpiTypesOptions: SelectOption[];
	protected selectedKpiType: string | number | boolean;

	private chartTypeChanged: boolean;
	private originalChartType: string | number | boolean;

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

	protected changeKpiType(event): void {
		this.selectedKpiType = event.detail.value;
		this.hasChanges = this.selectedKpiType !== this.originalChartType;
	}

	protected save(): void {
		localStorage.setItem("selectedKpiType", this.selectedKpiType.toString());
		this.chartTypeChanged = true;
		this.navController.navigateBack("home");
	}

	private async showSuccessToast(): Promise<void> {
		const toast = await this.toastController.create({
			message: "KPI values changed successfully!",
			duration: 3000,
			color: "success",
			icon: "checkmark-circle",
		});
		toast.present();
	}
}
