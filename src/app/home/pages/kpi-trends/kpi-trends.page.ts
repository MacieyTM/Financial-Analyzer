import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ChartOptions, ChartData, Chart } from "chart.js";
import { ScreenOrientation, OrientationType } from "@capawesome/capacitor-screen-orientation";
import { Capacitor } from "@capacitor/core";

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

	private borderColor: string;
	private data: number[];

	public constructor() {}

	public ngOnInit(): void {
		if (Capacitor.getPlatform() !== "web") {
			ScreenOrientation.lock({ type: OrientationType.LANDSCAPE });
		}

		this.data = this.getData();
		this.borderColor = getComputedStyle(document.documentElement).getPropertyValue(
			"--ion-color-primary"
		);

		this.chartData = {
			labels: this.getLabelMonths(),
			datasets: [
				{
					fill: true,
					data: this.data,
					borderColor: this.borderColor,
					label: "Money Amount",
				},
			],
		};

		this.chartOptions = {
			responsive: false,
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

	private getData(): number[] {
		return [65, 59, 80, 81, 56, 59, 80, 81, 56, 59, 80, 81];
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
