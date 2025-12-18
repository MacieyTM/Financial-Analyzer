import { ChangeDetectionStrategy, Component, OnInit, signal } from "@angular/core";
import { Chart, ChartConfiguration } from "chart.js";
import { ScreenOrientation, OrientationType } from "@capawesome/capacitor-screen-orientation";
import { Capacitor } from "@capacitor/core";
import { CHART_DATA_MONTHS, CHART_LABEL_MONTHS } from "src/app/models/chart.model";

import zoomPlugin from "chartjs-plugin-zoom";

Chart.register(zoomPlugin);

@Component({
	selector: "app-kpi-trends",
	templateUrl: "./kpi-trends.page.html",
	styleUrls: ["./kpi-trends.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiTrendsPage implements OnInit {
	protected chartDataLine: ChartConfiguration<"line">["data"];
	protected chartOptionsLine: ChartConfiguration<"line">["options"];

	protected chartDataBar: ChartConfiguration<"bar">["data"];
	protected chartOptionsBar: ChartConfiguration<"bar">["options"];

	protected chartDataDoughnut: ChartConfiguration<"doughnut">["data"];
	protected chartOptionsDoughnut: ChartConfiguration<"doughnut">["options"];

	protected readonly selectedChartType = signal<string>(
		localStorage.getItem("selectedKpiType") || "line"
	);

	private data: number[];
	private borderColor: string;
	private labelMonths: string[];
	private x: string;

	public ngOnInit(): void {
		if (Capacitor.getPlatform() !== "web") {
			ScreenOrientation.lock({ type: OrientationType.LANDSCAPE });
		}

		this.data = CHART_DATA_MONTHS;
		this.labelMonths = CHART_LABEL_MONTHS;
		this.borderColor = getComputedStyle(document.documentElement).getPropertyValue(
			"--ion-color-primary"
		);

		this.chartDataLine = {
			labels: this.labelMonths,
			datasets: [
				{
					fill: false,
					pointRadius: 0,
					data: this.data,

					borderColor: "#00f",
					backgroundColor: "#00f",
					pointBorderColor: "#00f",
					pointBackgroundColor: "#00f",
					pointHoverBorderColor: "#00f",
					pointHoverBackgroundColor: "#00f",
				},
			],
		};

		this.chartOptionsLine = {
			animation: false,
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					display: false,
				},
				tooltip: {
					enabled: false,
				},
			},
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

		this.chartDataBar = {
			labels: this.labelMonths,
			datasets: [
				{
					data: this.data,
					borderColor: this.borderColor,

					backgroundColor: "#00f",
					hoverBackgroundColor: "#0f0",
					hoverBorderColor: "#f00",

					borderWidth: 2,
				},
			],
		};

		this.chartOptionsBar = {
			animation: false,
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					display: true,
				},
				tooltip: {
					enabled: false,
				},
			},
		};

		this.chartDataDoughnut = {
			labels: this.labelMonths,
			datasets: [
				{
					data: this.data,
					borderColor: this.borderColor,

					backgroundColor: [
						"#f00",
						"#ff0",
						"#0f0",
						"#00f",
						"#f00",
						"#ff0",
						"#0f0",
						"#00f",
						"#f00",
						"#ff0",
						"#0f0",
						"#00f",
					],
					hoverBackgroundColor: [
						"#f00",
						"#ff0",
						"#0f0",
						"#00f",
						"#f00",
						"#ff0",
						"#0f0",
						"#00f",
						"#f00",
						"#ff0",
						"#0f0",
						"#00f",
					],
					hoverBorderColor: [
						"#f00",
						"#ff0",
						"#0f0",
						"#00f",
						"#f00",
						"#ff0",
						"#0f0",
						"#00f",
						"#f00",
						"#ff0",
						"#0f0",
						"#00f",
					],
				},
			],
		};

		this.chartOptionsDoughnut = {
			cutout: "50%",
			responsive: false,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					display: true,
				},
				tooltip: {
					enabled: false,
				},
			},
		};
	}

	public ngOnDestroy(): void {
		if (Capacitor.getPlatform() !== "web") {
			ScreenOrientation.lock({ type: OrientationType.PORTRAIT });
		}
	}
}
