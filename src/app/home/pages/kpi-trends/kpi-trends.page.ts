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
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { RobotoRegular } from "src/app/fonts/roboto";
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

		// this.startMonth.set(new Date(this.START_YEAR, this.MONTH_INDEX.indexOf("january"), 1));
		// this.endMonth.set(new Date(this.END_YEAR, this.MONTH_INDEX.indexOf("december"), 1));
		this.startMonth.set(new Date(this.START_YEAR, 0, 1));
		this.endMonth.set(new Date(this.END_YEAR, 11, 1));

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

	protected formatMonthValue(date: Date): string {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		return `${year}-${month}`;
	}

	protected async downloadPDF(): Promise<void> {
		// TODO - implement quarterly reports
		if (!this.chart?.chart || !this.data?.length) return;

		const values = this.data;
		const currency = this.getCurrencyForLocale(this.datetimeLocale);
		const total = values.reduce((s, v) => s + v, 0);
		const average = total / values.length;
		const min = Math.min(...values);
		const max = Math.max(...values);
		const bestMonthIndex = values.indexOf(min);
		const worstMonthIndex = values.indexOf(max);
		const translatedBestMonth = this.t(this.chartLabelMonths[bestMonthIndex].toLowerCase());
		const translatedWorstMonth = this.t(this.chartLabelMonths[worstMonthIndex].toLowerCase());
		const percentageChanges = values.map((v, i) =>
			i === 0 || values[i - 1] === 0 ? null : ((v - values[i - 1]) / values[i - 1]) * 100
		);
		const formatCurrency = (v: number) =>
			new Intl.NumberFormat(this.datetimeLocale, {
				style: "currency",
				currency,
			}).format(v);
		const formatPercent = (v: number | null) => (v === null ? "-" : `${v.toFixed(2)} %`);
		const canvas = this.chart.chart.canvas;
		const imageData = canvas.toDataURL("image/png", 1.0);
		const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: "a4" });
		pdf.addFileToVFS("Roboto-Regular.ttf", RobotoRegular);
		pdf.addFont("Roboto-Regular.ttf", "Roboto", "normal");
		pdf.setFont("Roboto");
		const pageWidth = pdf.internal.pageSize.getWidth();
		const pageHeight = pdf.internal.pageSize.getHeight();
		let y = 30;

		pdf.setFontSize(18);
		pdf.text(this.t("kpi_trends_report"), 20, y);
		y += 20;
		pdf.setFontSize(12);
		pdf.text(
			`${this.t("selected_range")}: ${this.formatMonthLabel(
				this.chartLabelMonths[0]
			)} – ${this.formatMonthLabel(this.chartLabelMonths[this.chartLabelMonths.length - 1])}`,
			20,
			y
		);
		y += 20;

		const chartHeight = pageHeight * 0.45;

		pdf.addImage(imageData, "PNG", 20, y, pageWidth - 40, chartHeight);
		y += chartHeight + 20;
		pdf.setFontSize(14);
		pdf.text(this.t("details"), 20, y);
		y += 15;

		const colMonth = 40;
		const colValue = 240;
		const colChange = 420;
		const rowHeight = 18;

		pdf.setFontSize(12);
		pdf.text(this.t("month"), colMonth, y);
		pdf.text(this.t("value"), colValue, y);
		pdf.text(this.t("monthly_change"), colChange, y);
		y += 8;
		pdf.line(20, y, pageWidth - 20, y);
		y += 12;
		this.chartLabelMonths.forEach((month, i) => {
			pdf.text(this.formatMonthLabel(month), colMonth, y);
			pdf.text(formatCurrency(values[i]), colValue, y);
			pdf.text(formatPercent(percentageChanges[i]), colChange, y);
			y += rowHeight;
		});
		y += 10;
		pdf.line(20, y, pageWidth - 20, y);
		y += 15;

		pdf.setFont("Roboto");
		pdf.text(this.t("total"), colMonth, y);
		pdf.text(formatCurrency(total), colValue, y);
		y += rowHeight;
		pdf.text(this.t("average"), colMonth, y);
		pdf.text(formatCurrency(average), colValue, y);
		y += rowHeight;
		pdf.text(this.t("min"), colMonth, y);
		pdf.text(formatCurrency(min), colValue, y);
		y += rowHeight;
		pdf.text(this.t("max"), colMonth, y);
		pdf.text(formatCurrency(max), colValue, y);

		if (Capacitor.getPlatform() === "web") {
			pdf.addPage();
			pdf.setFontSize(18);
			pdf.text(this.t("kpi_summary"), 20, 40);
			pdf.setFontSize(12);
			pdf.text(`${this.t("total")}: ${formatCurrency(total)}`, 20, 80);
			pdf.text(`${this.t("average")}: ${formatCurrency(average)}`, 20, 105);
			pdf.text(`${this.t("minimum")}: ${formatCurrency(min)}`, 20, 130);
			pdf.text(`${this.t("maximum")}: ${formatCurrency(max)}`, 20, 155);
			pdf.text(`${this.t("best_month")}: ${translatedBestMonth}`, 20, 190);
			pdf.text(`${this.t("worst_month")}: ${translatedWorstMonth}`, 20, 215);

			pdf.save("financial-analyzer-report.pdf");
		} else {
			await this.saveFileFromPDF(pdf, "financial-analyzer-report.pdf");
		}
	}

	protected async downloadCSV(): Promise<void> {
		// TODO - implement quarterly reports
		if (!this.data || !this.chartLabelMonths) return;

		const values = this.data;
		const total = values.reduce((s, v) => s + v, 0);
		const average = total / values.length;
		const min = Math.min(...values);
		const max = Math.max(...values);
		const bestMonthIndex = values.indexOf(min);
		const worstMonthIndex = values.indexOf(max);
		const translatedBestMonth = this.t(this.chartLabelMonths[bestMonthIndex].toLowerCase());
		const translatedWorstMonth = this.t(this.chartLabelMonths[worstMonthIndex].toLowerCase());
		const percentageChanges = values.map((v, i) =>
			i === 0 || values[i - 1] === 0 ? "" : (((v - values[i - 1]) / values[i - 1]) * 100).toFixed(2)
		);
		const formatNumber = (v: number) =>
			new Intl.NumberFormat(this.datetimeLocale, {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			}).format(v);
		const rows = [
			[this.t("month"), this.t("value"), this.t("monthly_change")],
			...this.chartLabelMonths.map((m, i) => [
				this.formatMonthLabel(m),
				formatNumber(values[i]),
				percentageChanges[i],
			]),
			[],
			[this.t("total"), formatNumber(total)],
			[this.t("average"), formatNumber(average)],
			[this.t("min"), formatNumber(min)],
			[this.t("max"), formatNumber(max)],
			[this.t("best_month"), translatedBestMonth],
			[this.t("worst_month"), translatedWorstMonth],
		];
		const BOM = "\uFEFF";
		const csvContent = BOM + rows.map((r) => r.join(";")).join("\n");

		if (Capacitor.getPlatform() === "web") {
			const blob = new Blob([csvContent], {
				type: "text/csv;charset=utf-8;",
			});
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");

			link.href = url;

			link.download = "financial-analyzer-report.csv";

			link.click();
			URL.revokeObjectURL(url);
		} else {
			// const base64Data = btoa(unescape(encodeURIComponent(csvContent)));
			const base64Data = btoa(csvContent);

			try {
				const savedFile = await Filesystem.writeFile({
					path: "financial-analyzer-report.csv",

					data: base64Data,
					directory: Directory.Cache,
					recursive: true,
				});

				await Share.share({
					title: "Financial Analyzer Report",

					text: "Here is your CSV report",
					url: savedFile.uri,
				});
				console.log("CSV saved at:", savedFile.uri);
			} catch (e) {
				console.log("Error saving CSV:", e);
			}
		}
	}

	private applyMonthRangeFilter(): void {
		const startIndex = this.startMonth().getMonth();
		const endIndex = this.endMonth().getMonth();

		const filteredData = this.allKpiData.filter((entry) => {
			const idx = this.MONTH_INDEX.indexOf(entry.month.toLowerCase());
			return idx >= startIndex && idx <= endIndex;
		});

		this.chartLabelMonths = filteredData.map((item) => this.capitalize(item.month));
		this.data = filteredData.map((item) => item.money);

		this.initializeChart();
		// if (this.data.length > 0) {
		// 	this.initializeChart();
		// } else {
		// 	this.chartDataLine = { labels: [], datasets: [{ data: [] }] };
		// 	this.chartDataBar = { labels: [], datasets: [{ data: [] }] };
		// 	// this.chartDataDoughnut = { labels: [], datasets: [{ data: [] }] };
		// }
	}

	private capitalize(value: string): string {
		return value.charAt(0).toUpperCase() + value.slice(1);
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

	private t(key: string): string {
		return this.translate.instant(key);
	}

	private formatMonthLabel(month: string): string {
		return new Intl.DateTimeFormat(this.datetimeLocale, { month: "long" }).format(
			new Date(this.START_YEAR, this.MONTH_INDEX.indexOf(month.toLowerCase()), 1)
		);
	}

	private getCurrencyForLocale(locale: string): string {
		switch (locale) {
			case "pl-PL":
				return "PLN";
			case "en-US":
				return "USD";
			case "en-GB":
				return "GBP";
			case "ja-JP":
				return "JPY";
			case "zh-CN":
				return "CNY";
			case "ko-KR":
				return "KRW";
			case "ru-RU":
				return "RUB";
			case "tr-TR":
				return "TRY";
			case "uk-UA":
				return "UAH";
			default:
				return "EUR";
		}
	}

	private setLanguage(savedLanguage: SupportedLanguage): void {
		const map: Record<SupportedLanguage, string> = {
			en: "en-US",
			pl: "pl-PL",
			de: "de-DE",
			fr: "fr-FR",
			it: "it-IT",
			es: "es-ES",
			zh: "zh-CN",
			hi: "hi-IN",
			pt: "pt-PT",
			ru: "ru-RU",
			ja: "ja-JP",
			ko: "ko-KR",
			tr: "tr-TR",
			nl: "nl-NL",
			uk: "uk-UA",
		};

		this.datetimeLocale = map[savedLanguage] || "en-US";
		// let locale = "en-US";

		// switch (savedLanguage) {
		// 	case "en":
		// 		locale = "en-US";
		// 		break;
		// 	case "pl":
		// 		locale = "pl-PL";
		// 		break;
		// 	case "de":
		// 		locale = "de-DE";
		// 		break;
		// 	case "fr":
		// 		locale = "fr-FR";
		// 		break;
		// 	case "it":
		// 		locale = "it-IT";
		// 		break;
		// 	case "es":
		// 		locale = "es-ES";
		// 		break;
		// 	case "zh":
		// 		locale = "zh-CN";
		// 		break;
		// 	case "hi":
		// 		locale = "hi-IN";
		// 		break;
		// 	case "pt":
		// 		locale = "pt-PT";
		// 		break;
		// 	case "ru":
		// 		locale = "ru-RU";
		// 		break;
		// 	case "ja":
		// 		locale = "ja-JP";
		// 		break;
		// 	case "ko":
		// 		locale = "ko-KR";
		// 		break;
		// 	case "tr":
		// 		locale = "tr-TR";
		// 		break;
		// 	case "nl":
		// 		locale = "nl-NL";
		// 		break;
		// 	case "uk":
		// 		locale = "uk-UA";
		// 		break;
		// 	default:
		// 		locale = "en-US";
		// }

		// this.datetimeLocale = locale;
	}

	private async saveFileFromPDF(pdf: jsPDF, fileName: string) {
		try {
			const pdfData = pdf.output("datauristring");
			const base64Data = pdfData.split(",")[1];
			const savedFile = await Filesystem.writeFile({
				path: fileName,
				data: base64Data,
				directory: Directory.Cache,
				recursive: true,
			});

			await Share.share({
				title: "Financial Analyzer Report",

				text: "Here is your PDF report",
				url: savedFile.uri,
			});
			console.log("PDF saved at:", savedFile.uri);
		} catch (e) {
			console.log("Error saving PDF:", e);
		}
	}
}
