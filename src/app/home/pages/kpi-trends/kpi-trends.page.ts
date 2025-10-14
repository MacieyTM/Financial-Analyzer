import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ChartOptions, ChartData } from "chart.js";

const MONTHS: string[] = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

@Component({
	selector: "app-kpi-trends",
	templateUrl: "./kpi-trends.page.html",
	styleUrls: ["./kpi-trends.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiTrendsPage implements OnInit {
	public chartOptions: ChartOptions = {
		responsive: true,
	};

	public chartData: ChartData = {
		labels: MONTHS,
		datasets: [
			{
				fill: true,
				label: "Money Amount",
				borderColor: "orange",
				data: [65, 59, 80, 81, 56, 59, 80, 81, 56, 59, 80, 81],
			},
		],
	};

	constructor() {}

	ngOnInit() {}
}
