import { ChangeDetectionStrategy, Component, OnInit, signal } from "@angular/core";
import { ChartConfiguration } from "chart.js";
import { ScreenOrientation, OrientationType } from "@capawesome/capacitor-screen-orientation";
import { Capacitor } from "@capacitor/core";
import { SupportedChartTypes } from "src/app/models/chart.model";
import { CHART_BORDER_COLOR } from "../../home.page";
import { SupportedLanguage } from "src/app/models/languages.model";
import { TranslateService } from "@ngx-translate/core";

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
	protected readonly selectedChartType = signal<SupportedChartTypes>(
		(localStorage.getItem("selectedKpiType") as SupportedChartTypes) || "bar"
	);

	protected chartDataLine: ChartConfiguration<"line">["data"];
	protected chartOptionsLine: ChartConfiguration<"line">["options"];

	protected chartDataBar: ChartConfiguration<"bar">["data"];
	protected chartOptionsBar: ChartConfiguration<"bar">["options"];

	// protected chartDataDoughnut: ChartConfiguration<"doughnut">["data"];
	// protected chartOptionsDoughnut: ChartConfiguration<"doughnut">["options"];

	protected hasKpiData = false;
	protected datetimeLocale: string;

	protected readonly startMonth = signal<Date | null>(null);
	protected readonly endMonth = signal<Date | null>(null);

	private data: number[];
	private labelMonths: string[];
	private allKpiData: KpiEntry[] = [];
	private savedLanguage: SupportedLanguage;

	private readonly START_YEAR = 2026;
	private readonly END_YEAR = 2026;
	private readonly MONTH_INDEX: string[] = [
		"january",
		"february",
		"march",
		"april",
		"may",
		"june",
		"july",
		"august",
		"september",
		"october",
		"november",
		"december",
	];

	constructor(private readonly translate: TranslateService) {
		this.initializeLanguage();
	}

	public ngOnInit(): void {
		if (Capacitor.getPlatform() !== "web") {
			ScreenOrientation.lock({ type: OrientationType.LANDSCAPE });
		}

		this.allKpiData = JSON.parse(localStorage.getItem("kpiData")) || [];
		this.hasKpiData = this.allKpiData.length > 0;

		this.startMonth.set(new Date(this.START_YEAR, this.MONTH_INDEX.indexOf("january"), 1));
		this.endMonth.set(new Date(this.END_YEAR, this.MONTH_INDEX.indexOf("december"), 1));

		if (this.hasKpiData) {
			this.applyMonthRangeFilter();
		}
	}

	public ngOnDestroy(): void {
		if (Capacitor.getPlatform() !== "web") {
			ScreenOrientation.lock({ type: OrientationType.PORTRAIT });
		}
	}

	protected onStartMonthChange(event: CustomEvent): void {
		const value = event.detail.value as string | null;
		if (!value) return;

		const [, month] = value.split("-");
		this.startMonth.set(new Date(2026, Number(month) - 1, 1));

		this.applyMonthRangeFilter();
	}

	protected onEndMonthChange(event: CustomEvent): void {
		const value = event.detail.value as string | null;
		if (!value) return;

		const [, month] = value.split("-");
		this.endMonth.set(new Date(2026, Number(month) - 1, 1));

		this.applyMonthRangeFilter();
	}

	private applyMonthRangeFilter(): void {
		const startIndex = this.startMonth().getMonth();
		const endIndex = this.endMonth().getMonth();

		const filteredData = this.allKpiData.filter((entry) => {
			const entryIndex = this.MONTH_INDEX.indexOf(entry.month.toLowerCase());

			if (startIndex !== undefined && entryIndex < startIndex) return false;
			if (endIndex !== undefined && entryIndex > endIndex) return false;

			return true;
		});

		this.labelMonths = filteredData.map((item) => this.capitalize(item.month));
		this.data = filteredData.map((item) => item.money);

		if (this.data.length > 0) {
			this.initializeChart();
		} else {
			this.chartDataLine = { labels: [], datasets: [{ data: [] }] };
			this.chartDataBar = { labels: [], datasets: [{ data: [] }] };
			// this.chartDataDoughnut = { labels: [], datasets: [{ data: [] }] };
		}
	}

	private capitalize(value: string): string {
		return value.charAt(0).toUpperCase() + value.slice(1);
	}

	protected formatMonthValue(date: Date): string {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		return `${year}-${month}`;
	}

	private initializeLanguage(): void {
		// this.selectedLanguage =
		// 	localStorage.getItem("selectedLang") ||
		// 	localStorage.getItem("deviceLanguage") ||
		// 	localStorage.getItem("browserLanguage") ||
		// 	this.translateService.getSystemLanguage() ||
		// 	"en";

		this.savedLanguage = localStorage.getItem("selectedLang") || "en";

		if (!this.translate.getLangs().includes(this.savedLanguage)) {
			this.savedLanguage = "en";
		}

		this.setLanguage(this.savedLanguage);
	}

	private setLanguage(savedLanguage: SupportedLanguage): void {
		let locale = "en-US";

		switch (savedLanguage) {
			case "en":
				locale = "en-US";
				break;
			case "pl":
				locale = "pl-PL";
				break;
			case "de":
				locale = "de-DE";
				break;
			case "fr":
				locale = "fr-FR";
				break;
			case "it":
				locale = "it-IT";
				break;
			case "es":
				locale = "es-ES";
				break;
			case "zh":
				locale = "zh-CN";
				break;
			case "hi":
				locale = "hi-IN";
				break;
			case "pt":
				locale = "pt-PT";
				break;
			case "ru":
				locale = "ru-RU";
				break;
			case "ja":
				locale = "ja-JP";
				break;
			case "ko":
				locale = "ko-KR";
				break;
			case "tr":
				locale = "tr-TR";
				break;
			case "nl":
				locale = "nl-NL";
				break;
			case "uk":
				locale = "uk-UA";
				break;
			default:
				locale = "en-US";
		}

		this.datetimeLocale = locale;
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
				datalabels: {
					font: {
						size: 0,
					},
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
					display: false,
				},
				tooltip: {
					enabled: false,
				},
				datalabels: {
					font: {
						size: 0,
					},
				},
			},
		};

		// this.chartDataDoughnut = {
		// 	labels: this.labelMonths,
		// 	datasets: [
		// 		{
		// 			data: this.data,
		// 			borderColor: CHART_BORDER_COLOR,
		// 			backgroundColor: [
		// 				"#f00",
		// 				"#ff0",
		// 				"#0f0",
		// 				"#00f",
		// 				"#f00",
		// 				"#ff0",
		// 				"#0f0",
		// 				"#00f",
		// 				"#f00",
		// 				"#ff0",
		// 				"#0f0",
		// 				"#00f",
		// 			],
		// 			hoverBackgroundColor: [
		// 				"#f00",
		// 				"#ff0",
		// 				"#0f0",
		// 				"#00f",
		// 				"#f00",
		// 				"#ff0",
		// 				"#0f0",
		// 				"#00f",
		// 				"#f00",
		// 				"#ff0",
		// 				"#0f0",
		// 				"#00f",
		// 			],
		// 			hoverBorderColor: [
		// 				"#f00",
		// 				"#ff0",
		// 				"#0f0",
		// 				"#00f",
		// 				"#f00",
		// 				"#ff0",
		// 				"#0f0",
		// 				"#00f",
		// 				"#f00",
		// 				"#ff0",
		// 				"#0f0",
		// 				"#00f",
		// 			],
		// 		},
		// 	],
		// };

		// this.chartOptionsDoughnut = {
		// 	cutout: "50%",
		// 	responsive: false,
		// 	maintainAspectRatio: false,
		// 	plugins: {
		// 		legend: {
		// 			display: false,
		// 		},
		// 		tooltip: {
		// 			enabled: false,
		// 		},
		// 	},
		// };
	}
}
