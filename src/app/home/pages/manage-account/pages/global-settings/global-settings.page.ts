import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { NavController, ToastController } from "@ionic/angular";
import { DEFAULT_CHART_TYPE } from "src/app/home/home.page";
import { CHART_TYPES, SupportedChartTypes } from "src/app/models/chart.model";
import { SelectOption } from "src/app/models/kpi.model";
import { AppTranslatePipe } from "src/app/pipes/translate.pipe";

@Component({
	selector: "app-global-settings",
	templateUrl: "./global-settings.page.html",
	styleUrls: ["./global-settings.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSettingsPage implements OnInit, OnDestroy {
	protected hasChanges = false;
	protected kpiTypesOptions: SelectOption[];
	protected selectedKpiType: string;

	private chartTypeChanged: boolean;
	private originalChartType: string;

	constructor(
		private readonly navController: NavController,
		private readonly toastController: ToastController,
		private readonly translatePipe: AppTranslatePipe
	) {}

	ngOnInit() {
		const storedKpiType = localStorage.getItem("selectedKpiType");

		this.kpiTypesOptions = CHART_TYPES;
		this.originalChartType = storedKpiType ?? DEFAULT_CHART_TYPE;
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

	protected changeKpiType(event: CustomEvent): void {
		this.selectedKpiType = event.detail.value;
		this.hasChanges = this.selectedKpiType !== this.originalChartType;
	}

	protected save(): void {
		localStorage.setItem("selectedKpiType", this.selectedKpiType.toString());
		this.chartTypeChanged = true;
		this.navController.navigateBack("home");
	}

	protected translateLabel(label: string): string {
		const translated = this.translatePipe.transform(
			label,
			label.toLowerCase() as SupportedChartTypes
		);

		return translated;
	}

	private async showSuccessToast(): Promise<void> {
		const toast = await this.toastController.create({
			// header: 'Success',
			message: this.translatePipe.transform(
				"Chart data type changed successfully!",
				"chart_data_type_changed_successfully"
			),
			duration: 3000,
			color: "success",
			icon: "checkmark-circle",
		});
		toast.present();
	}
}
