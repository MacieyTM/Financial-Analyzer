import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnInit,
	signal,
} from "@angular/core";
import { CHART_LABEL_MONTHS, CHART_LABEL_QUARTERS } from "src/app/models/chart.model";
import { PhotoService } from "../services/photo.service";
import { ChartConfiguration } from "chart.js";
import { KpiEntry } from "./pages/kpi-trends/kpi-trends.page";

export const BORDER_COLOR = getComputedStyle(document.documentElement).getPropertyValue(
	"--ion-color-primary"
);

// const BANK_ACCOUNT_AMOUNT: number = 1234567.89;
const BANK_ACCOUNT_AMOUNT: number = +localStorage.getItem("selectedMoney");

@Component({
	selector: "app-home",
	templateUrl: "home.page.html",
	styleUrls: ["home.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage implements OnInit {
	protected readonly bankAccountAmount = signal<string>(BANK_ACCOUNT_AMOUNT.toLocaleString());
	protected readonly helpVisible = signal<boolean>(false);
	protected chartData: ChartConfiguration<"doughnut">["data"];
	protected chartOptions: ChartConfiguration<"doughnut">["options"];

	private data: number[];

	constructor(
		protected readonly photoService: PhotoService,
		private readonly cdr: ChangeDetectorRef
	) {}

	public ngOnInit(): void {
		this.data = this.calculateQuarterData();

		this.chartData = {
			labels: CHART_LABEL_QUARTERS,
			datasets: [
				{
					data: this.data,
					borderColor: BORDER_COLOR,

					backgroundColor: ["#f00", "#ff0", "#0f0", "#00f"],
					hoverBackgroundColor: ["#f00", "#ff0", "#0f0", "#00f"],
					hoverBorderColor: ["#f00", "#ff0", "#0f0", "#00f"],

					spacing: 4,
					borderWidth: 4,
					borderRadius: 8,
				},
			],
		};

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

		this.cdr.detectChanges();
	}

	protected addPhotoToStorage(): void {
		this.photoService.addNewToGallery();
	}

	protected toggleHelp(): void {
		this.helpVisible.update((prev) => !prev);
	}

	private calculateQuarterData(): number[] {
		const storedKpiData: KpiEntry[] = JSON.parse(localStorage.getItem("kpiData")) || [];
		const monthIndexMap: Record<string, number> = {};

		CHART_LABEL_MONTHS.forEach((month, i) => (monthIndexMap[month.toLowerCase()] = i));

		const quarters = [0, 0, 0, 0];

		storedKpiData.forEach((entry) => {
			const monthIdx = monthIndexMap[entry.month.toLowerCase()];

			if (monthIdx !== undefined) {
				const quarter = Math.floor(monthIdx / 3);
				quarters[quarter] += entry.money;
			}
		});

		console.log("Calculated Quarters:", quarters);

		return quarters;
	}
}
