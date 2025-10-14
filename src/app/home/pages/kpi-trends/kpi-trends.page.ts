import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ChartOptions, ChartData, Chart } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";

Chart.register(zoomPlugin);

@Component({
	selector: "app-kpi-trends",
	templateUrl: "./kpi-trends.page.html",
	styleUrls: ["./kpi-trends.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiTrendsPage implements OnInit {
	protected chartData: ChartData;
	protected chartOptions: ChartOptions;

	constructor() {}

	ngOnInit() {
		this.chartData = {
			labels: this.getLabelMonths(),
			datasets: [
				{
					fill: true,
					label: "Money Amount",
					borderColor: "orange",
					data: [65, 59, 80, 81, 56, 59, 80, 81, 56, 59, 80, 81],
				},
			],
		};

		this.chartOptions = {
			responsive: true,
			// plugins: {
			// 	zoom: {
			// 		zoom: {
			// 			wheel: {
			// 				enabled: true,
			// 				speed: 0.3,
			// 			},
			// 			pinch: {
			// 				enabled: true,
			// 			},
			// 			drag: {
			// 				enabled: false,
			// 			},
			// 			mode: "x",
			// 		},
			// 		pan: {
			// 			enabled: true,
			// 			threshold: 10,
			// 			modifierKey: null,
			// 			mode: "x",
			// 		},
			// 	},
			// },
		};
	}

	private getLabelMonths(): string[] {
		return [
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
	}
}
