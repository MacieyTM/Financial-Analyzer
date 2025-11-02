import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { NavController, ToastController } from "@ionic/angular";
import { AppTranslatePipe } from "src/app/pipes/translate.pipe";

@Component({
	selector: "app-global-settings",
	templateUrl: "./global-settings.page.html",
	styleUrls: ["./global-settings.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSettingsPage implements OnInit, OnDestroy {
	protected kpiTypesOptions: any;
	protected selectedKpiType: string = "";
	private chartTypeChanged: boolean;

	constructor(
		private readonly navController: NavController,
		private readonly toastController: ToastController,
		private readonly translatePipe: AppTranslatePipe
	) {}

	ngOnInit() {
		this.kpiTypesOptions = [
			{ value: "line", label: "Line" },
			{ value: "bar", label: "Bar" },
			{ value: "doughnut", label: "Doughnut" },
		];

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
	}

	protected save(): void {
		localStorage.setItem("selectedKpiType", this.selectedKpiType);
		this.navController.navigateBack("home");
	}

	private async showSuccessToast(): Promise<void> {
		const toast = await this.toastController.create({
			message: this.translatePipe.transform(
				"Chart type changed successfully!",
				"chart_type_changed_successfully"
			),
			duration: 3000,
			color: "success",
			icon: "checkmark-circle",
		});
		toast.present();
	}
}
