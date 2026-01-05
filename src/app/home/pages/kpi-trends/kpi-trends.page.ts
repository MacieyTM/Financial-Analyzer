import { ChangeDetectionStrategy, Component, OnInit, signal, ViewChild } from "@angular/core";
import { ChartConfiguration } from "chart.js";
import { ScreenOrientation, OrientationType } from "@capawesome/capacitor-screen-orientation";
import { Capacitor } from "@capacitor/core";
import { SupportedChartTypes } from "src/app/models/chart.model";
import { CHART_BORDER_COLOR } from "../../home.page";
import { SupportedLanguage } from "src/app/models/languages.model";
import { TranslateService } from "@ngx-translate/core";
import { AppTranslatePipe } from "src/app/pipes/translate.pipe";
import { SupportedLabelMonths } from "src/app/models/kpi.model";
import { BaseChartDirective } from "ng2-charts";
import jsPDF from "jspdf";

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
	@ViewChild(BaseChartDirective) chart?: BaseChartDirective;

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
	private chartLabelMonths: string[];
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

	constructor(
		private readonly translate: TranslateService,
		private readonly translatePipe: AppTranslatePipe
	) {
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

	protected downloadPDF(): void {
		if (!this.chart?.chart) return;

		const canvas = this.chart.chart.canvas;
		const imageData = canvas.toDataURL("image/png", 1.0);
		const pdf = new jsPDF({
			orientation: "landscape",
			unit: "px",
			format: "a4",
		});
		const pageWidth = pdf.internal.pageSize.getWidth();
		const pageHeight = pdf.internal.pageSize.getHeight();
		let y = 30;

		pdf.setFontSize(18);
		pdf.text("KPI Trends Report", 20, y);
		y += 20;
		pdf.setFontSize(12);
		pdf.text(
			`Selected range: ${this.chartLabelMonths[0]} – ${
				this.chartLabelMonths[this.chartLabelMonths.length - 1]
			}`,
			20,
			y
		);
		y += 20;

		const chartHeight = pageHeight * 0.45;

		pdf.addImage(imageData, "PNG", 20, y, pageWidth - 40, chartHeight);
		y += chartHeight + 20;
		pdf.setFontSize(14);
		pdf.text("Details", 20, y);
		y += 15;

		const colMonth = 40;
		const colValue = 220;
		const rowHeight = 18;

		pdf.setFontSize(12);
		pdf.text("Month", colMonth, y);
		pdf.text("Value", colValue, y);
		y += 8;
		pdf.line(20, y, pageWidth - 20, y);
		y += 12;
		this.chartLabelMonths.forEach((month, index) => {
			pdf.text(month, colMonth, y);
			pdf.text(this.data[index].toString(), colValue, y);

			y += rowHeight;

			if (y > pageHeight - 30) {
				pdf.addPage();
				y = 40;
			}
		});

		const total = this.data.reduce((sum, v) => sum + v, 0);
		const average = this.data.length ? total / this.data.length : 0;
		// const formatValue = (value: number) =>
		// 	new Intl.NumberFormat(this.datetimeLocale, {
		// 		style: "currency",
		// 		currency: "PLN",
		// 	}).format(value);

		y += 5;
		pdf.line(20, y, pageWidth - 20, y);
		y += 15;
		pdf.setFont(undefined, "bold");
		pdf.text("Total", colMonth, y);
		// pdf.text(formatValue(total), colValue, y);
		pdf.text(total.toString(), colValue, y);
		y += rowHeight;
		pdf.setFont(undefined, "normal");
		pdf.text("Average", colMonth, y);
		// pdf.text(formatValue(average), colValue, y);
		pdf.text(average.toString(), colValue, y);

		pdf.save("financial-analyzer-report.pdf");
	}

	protected downloadCSV(): void {
		if (!this.data || !this.chartLabelMonths) return;

		const rows = [
			["Month", "Value"],
			...this.chartLabelMonths.map((month, i) => [month, this.data[i].toString()]),
		];
		const csvContent = rows.map((e) => e.join(",")).join("\n");
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");

		link.href = url;
		link.download = "financial-analyzer-report.csv";
		link.click();
		URL.revokeObjectURL(url);
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

		this.chartLabelMonths = filteredData.map((item) => this.capitalize(item.month));
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
			labels: this.translateChartLabelMonths(),
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
			labels: this.translateChartLabelMonths(),
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
		// 	labels: this.translateChartLabelMonths(),
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

	private translateChartLabelMonths(): string[] {
		const translated = this.chartLabelMonths.map((chartLabelMonth) =>
			this.translatePipe.transform(
				chartLabelMonth,
				chartLabelMonth.toLowerCase() as SupportedLabelMonths
			)
		);

		return translated;
	}
}
