import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
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
	protected chartData: ChartConfiguration<"line">["data"];
	protected chartOptions: ChartConfiguration<"line">["options"];

	private data: number[];
	private borderColor: string;
	private labelMonths: string[];

	public ngOnInit(): void {
		if (Capacitor.getPlatform() !== "web") {
			ScreenOrientation.lock({ type: OrientationType.LANDSCAPE });
		}

		this.data = CHART_DATA_MONTHS;
		this.labelMonths = CHART_LABEL_MONTHS;
		this.borderColor = getComputedStyle(document.documentElement).getPropertyValue(
			"--ion-color-primary"
		);

		this.chartData = {
			labels: this.labelMonths,
			datasets: [
				{
					fill: true,
					data: this.data,
					borderColor: this.borderColor,
				},
			],
		};

		this.chartOptions = {
			animation: false,
			responsive: false,
			maintainAspectRatio: false,
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

	public ngOnDestroy(): void {
		if (Capacitor.getPlatform() !== "web") {
			ScreenOrientation.lock({ type: OrientationType.PORTRAIT });
		}
	}
}
