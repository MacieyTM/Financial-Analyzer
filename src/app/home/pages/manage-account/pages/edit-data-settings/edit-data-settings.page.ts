import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { NavController, ToastController } from "@ionic/angular";
import { CHART_LABEL_MONTHS } from "src/app/models/chart.model";
import { MONTHS_LABELS, SelectOption, SupportedLabelMonths } from "src/app/models/kpi.model";
import { MONEY_VALUES } from "src/app/models/kpi.model";
import { KpiEntry } from "../../../kpi-trends/kpi-trends.page";
import { AppTranslatePipe } from "src/app/pipes/translate.pipe";

@Component({
	selector: "app-edit-data-settings",
	templateUrl: "./edit-data-settings.page.html",
	styleUrls: ["./edit-data-settings.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditDataSettingsPage implements OnInit, OnDestroy {
	protected monthsOptions: SelectOption[];
	protected moneyOptions: SelectOption[];

	// !important to keep as string here for ion-select
	protected selectedMoney: string = "";
	protected selectedMonth: string = "";

	private kpiChanged: boolean;

	constructor(
		private readonly navController: NavController,
		private readonly toastController: ToastController,
		private readonly translatePipe: AppTranslatePipe
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

	protected changeMonth(event: CustomEvent): void {
		this.selectedMonth = event.detail.value;
	}

	protected changeMoney(event: CustomEvent): void {
		this.selectedMoney = event.detail.value;
	}

	protected cancel(): void {
		this.navController.back();
	}

	protected save(): void {
		const selectedMonth = this.selectedMonth;
		const selectedMoney = parseInt(this.selectedMoney);
		const storedKpiData = JSON.parse(localStorage.getItem("kpiData")) || [];
		const existingMonthIndex = storedKpiData.findIndex(
			(item: KpiEntry) => item.month === selectedMonth
		);

		if (existingMonthIndex >= 0) {
			// Update the existing month's money value as setting
			storedKpiData[existingMonthIndex].money = selectedMoney;
		} else {
			storedKpiData.push({ month: selectedMonth, money: selectedMoney });
		}

		const monthOrder: Record<string, number> = {};
		CHART_LABEL_MONTHS.forEach((month, i) => (monthOrder[month.toLowerCase()] = i));

		storedKpiData.sort((a: KpiEntry, b: KpiEntry) => {
			const aIndex = monthOrder[a.month.toLowerCase()] ?? 12;
			const bIndex = monthOrder[b.month.toLowerCase()] ?? 12;

			return aIndex - bIndex;
		});

		localStorage.setItem("kpiData", JSON.stringify(storedKpiData));

		this.kpiChanged = true;
		this.navController.navigateBack("/home");
	}

	protected translateLabel(label: string): string {
		const translated = this.translatePipe.transform(
			label,
			label.toLowerCase() as SupportedLabelMonths
		);

		return translated;
	}

	private async showSuccessToast(): Promise<void> {
		const toast = await this.toastController.create({
			// header: 'Success',
			message: this.translatePipe.transform(
				"KPI values saved successfully!",
				"kpi_values_saved_successfully"
			),
			duration: 3000,
			color: "success",
			icon: "checkmark-circle",
		});
		toast.present();
	}
}
