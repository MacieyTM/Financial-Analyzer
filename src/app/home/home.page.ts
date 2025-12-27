import { ChangeDetectionStrategy, ChangeDetectorRef, Component, signal } from "@angular/core";
import {
	CHART_LABEL_MONTHS,
	CHART_LABEL_QUARTERS,
	SupportedChartTypes,
} from "src/app/models/chart.model";
import { PhotoService } from "../services/photo.service";
import { ChartConfiguration } from "chart.js";
import { KpiEntry } from "./pages/kpi-trends/kpi-trends.page";

export const DEFAULT_CHART_TYPE: SupportedChartTypes = "bar";
export const CHART_BORDER_COLOR: string = getComputedStyle(
	document.documentElement
).getPropertyValue("--ion-color-primary");

// const BANK_ACCOUNT_AMOUNT: number = 107800.22;
// const BANK_ACCOUNT_AMOUNT: number = +localStorage.getItem("selectedMoney");

@Component({
	selector: "app-home",
	templateUrl: "home.page.html",
	styleUrls: ["home.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
	protected readonly helpVisible = signal<boolean>(false);
	protected readonly isDarkMode = signal(document.body.classList.contains("dark"));
	// protected readonly bankAccountAmount = signal<string>(BANK_ACCOUNT_AMOUNT.toLocaleString());

	protected data: number[];
	protected userName: string;
	protected userNick: string;
	protected chartData: ChartConfiguration<"doughnut">["data"];
	protected chartOptions: ChartConfiguration<"doughnut">["options"];

	constructor(
		private readonly cdr: ChangeDetectorRef,
		private readonly photoService: PhotoService
	) {}

	protected toggleDarkMode(event: CustomEvent): void {
		const enabled = event.detail.checked;

		document.body.classList.toggle("dark", enabled);
		this.isDarkMode.set(enabled);

		localStorage.setItem("darkMode", String(enabled));
	}

	public ngOnInit(): void {
		this.refreshData();

		this.chartOptions = {
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

	public ionViewWillEnter(): void {
		this.refreshData();
	}

	protected addPhotoToStorage(): void {
		this.photoService.addNewToGallery();
	}

	protected toggleHelp(): void {
		this.helpVisible.update((prev) => !prev);
	}

	protected chartHasData(): boolean {
		return this.data.some((value) => value > 0);
	}

	private calculateQuarterData(): number[] {
		const storedKpiData: KpiEntry[] = JSON.parse(localStorage.getItem("kpiData")) || [];
		const monthIndexMap: Record<string, number> = {};

		CHART_LABEL_MONTHS.forEach((month, i) => (monthIndexMap[month.toLowerCase()] = i));

		const quarters = [0, 0, 0, 0];

		storedKpiData.forEach((entry) => {
			const monthIdx = monthIndexMap[entry.month.toLowerCase()];

			if (monthIdx) {
				const quarter = Math.floor(monthIdx / 3);
				quarters[quarter] += entry.money;
			}
		});

		return quarters;
	}

	private calculateChartData(): ChartConfiguration<"doughnut">["data"] {
		this.data = this.calculateQuarterData();

		return {
			labels: CHART_LABEL_QUARTERS,
			datasets: [
				{
					data: this.data,
					borderColor: CHART_BORDER_COLOR,
					backgroundColor: ["#f00", "#ff0", "#0f0", "#00f"],
					hoverBackgroundColor: ["#f00", "#ff0", "#0f0", "#00f"],
					hoverBorderColor: ["#f00", "#ff0", "#0f0", "#00f"],
					spacing: 4,
					borderWidth: 4,
					borderRadius: 8,
				},
			],
		};
	}

	private refreshData(): void {
		this.userName = localStorage.getItem("userName") || "";
		this.userNick = localStorage.getItem("userNick") || "";

		this.chartData = this.calculateChartData();
		this.cdr.detectChanges();
	}
}
