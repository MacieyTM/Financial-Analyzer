import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";

@Component({
	selector: "app-add-kpi-values",
	templateUrl: "./add-kpi-values.page.html",
	styleUrls: ["./add-kpi-values.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddKpiValuesPage implements OnInit {
	protected kpTypesOptions: any;

	constructor(private readonly navController: NavController) {}

	ngOnInit() {
		this.kpTypesOptions = [
			{ value: "line", label: "line" },
			{ value: "bar", label: "bar" },
			{ value: "doughnut", label: "doughnut" },
		];
	}

	protected cancel(): void {
		this.navController.back();
	}
}
