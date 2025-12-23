import { ChangeDetectionStrategy, Component, OnInit, signal } from "@angular/core";
import { Chart, ChartConfiguration } from "chart.js";
import { ScreenOrientation, OrientationType } from "@capawesome/capacitor-screen-orientation";
import { Capacitor } from "@capacitor/core";
import { CHART_LABEL_MONTHS, SupportedChartTypes } from "src/app/models/chart.model";
import zoomPlugin from "chartjs-plugin-zoom";
import { CHART_BORDER_COLOR } from "../../home.page";

Chart.register(zoomPlugin);

export interface KpiEntry {
	month: string;
	money: number;
}

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

	protected readonly selectedChartType = signal<SupportedChartTypes>(
		(localStorage.getItem("selectedKpiType") as SupportedChartTypes) || "bar"
	);

	protected hasKpiData = false;

	private data: number[];
	private labelMonths: string[];

	public ngOnInit(): void {
		if (Capacitor.getPlatform() !== "web") {
			ScreenOrientation.lock({ type: OrientationType.LANDSCAPE });
		}

		const storedKpiData = JSON.parse(localStorage.getItem("kpiData")) || [];

		this.hasKpiData = storedKpiData.length > 0;

		this.labelMonths = storedKpiData.map((item: KpiEntry) => item.month) || CHART_LABEL_MONTHS;
		this.data = storedKpiData.map((item: KpiEntry) => item.money) || [];

		if (this.hasKpiData) {
			this.initializeChart();
		}
	}

	public ngOnDestroy(): void {
		if (Capacitor.getPlatform() !== "web") {
			ScreenOrientation.lock({ type: OrientationType.PORTRAIT });
		}
	}

	private initializeChart(): void {
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
				// zoom: {
				// 	zoom: {
				// 		wheel: {
				// 			enabled: true,
				// 			speed: 0.3,
				// 		},
				// 		pinch: {
				// 			enabled: true,
				// 		},
				// 		drag: {
				// 			enabled: false,
				// 		},
				// 		mode: "x",
				// 	},
				// 	pan: {
				// 		enabled: true,
				// 		threshold: 10,
				// 		modifierKey: null,
				// 		mode: "x",
				// 	},
				// },
			},
		};

		this.chartDataBar = {
			labels: this.labelMonths,
			datasets: [
				{
					data: this.data,
					borderColor: CHART_BORDER_COLOR,

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
					borderColor: CHART_BORDER_COLOR,
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
}
