import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { NavController, ToastController } from "@ionic/angular";
import { MONTHS_LABELS } from "src/app/models/kpi.model";
import { MONEY_VALUES } from "src/app/models/kpi.model";

@Component({
	selector: "app-add-kpi-values",
	templateUrl: "./add-kpi-values.page.html",
	styleUrls: ["./add-kpi-values.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddKpiValuesPage implements OnInit, OnDestroy {
	protected monthsOptions: any;
	protected moneyOptions: any;

	protected selectedMonth: string = "";
	protected selectedMoney: string = "";

	private kpiChanged: boolean;

	constructor(
		private readonly navController: NavController,
		private toastController: ToastController
	) {}

	public ngOnInit() {
		this.monthsOptions = MONTHS_LABELS;
		this.moneyOptions = MONEY_VALUES;

		this.kpiChanged = false;
	}

	public ngOnDestroy(): void {
		if (this.kpiChanged) {
			this.showSuccessToast();
		}
	}

	protected changeMonth(event: any): void {
		this.selectedMonth = event.detail.value;
	}

	protected changeMoney(event: any): void {
		this.selectedMoney = event.detail.value;
	}

	protected cancel(): void {
		this.navController.back();
	}

	protected save(): void {
		localStorage.setItem("selectedMonth", this.selectedMonth);
		localStorage.setItem("selectedMoney", this.selectedMoney);
		this.kpiChanged = true;
		this.navController.back();
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
