import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { MONTHS_LABELS } from "src/app/models/kpi.model";
import { MONEY_VALUES } from "src/app/models/kpi.model";

@Component({
	selector: "app-add-kpi-values",
	templateUrl: "./add-kpi-values.page.html",
	styleUrls: ["./add-kpi-values.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddKpiValuesPage implements OnInit {
	protected monthsOptions: any;
	protected moneyOptions: any;

	protected selectedMonth: string = "";
	protected selectedMoney: string = "";

	constructor(private readonly navController: NavController) {}

	public ngOnInit() {
		this.monthsOptions = MONTHS_LABELS;
		this.moneyOptions = MONEY_VALUES;
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
		this.navController.back();
	}
}
