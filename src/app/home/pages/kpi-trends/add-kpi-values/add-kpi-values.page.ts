import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
	selector: "app-add-kpi-values",
	templateUrl: "./add-kpi-values.page.html",
	styleUrls: ["./add-kpi-values.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddKpiValuesPage implements OnInit {
	protected readonly kpTypesOptions = [
		{ value: "line", label: "line" },
		{ value: "bar", label: "bar" },
		{ value: "doughnut", label: "doughnut" },
	];

	constructor() {}

	ngOnInit() {}
}
