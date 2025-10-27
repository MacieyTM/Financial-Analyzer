import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";

@Component({
	selector: "app-add-kpi-values",
	templateUrl: "./add-kpi-values.page.html",
	styleUrls: ["./add-kpi-values.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddKpiValuesPage implements OnInit {
	protected kpiTypesOptions: any;
	protected monthsOptions: any;

	constructor(private readonly navController: NavController) {}

	ngOnInit() {
		this.kpiTypesOptions = [
			{ value: "line", label: "Line" },
			{ value: "bar", label: "Bar" },
			{ value: "doughnut", label: "Doughnut" },
		];

		this.monthsOptions = [
			{ value: "january", label: "January" },
			{ value: "february", label: "February" },
			{ value: "march", label: "March" },
			{ value: "april", label: "April" },
			{ value: "may", label: "May" },
			{ value: "june", label: "June" },
			{ value: "july", label: "July" },
			{ value: "august", label: "August" },
			{ value: "september", label: "September" },
			{ value: "october", label: "October" },
			{ value: "novemeber", label: "Novemeber" },
			{ value: "december", label: "December" },
		];
	}

	protected cancel(): void {
		this.navController.back();
	}
}
