import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { Capacitor } from "@capacitor/core";
import { ChartConfiguration } from "chart.js";
import { CHART_DATA_QUARTERS } from "src/app/models/chart.model";

const BANK_ACCOUNT_AMOUNT: number = 1234567.89;

@Component({
	selector: "app-home",
	templateUrl: "home.page.html",
	styleUrls: ["home.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
	protected readonly bankAccountAmount = signal<string>(BANK_ACCOUNT_AMOUNT.toLocaleString());
	protected chartData: ChartConfiguration<"doughnut">["data"];
	protected chartOptions: ChartConfiguration<"doughnut">["options"];

	private data: number[];
	private borderColor: string;
	private imagePath: string;

	public ngOnInit(): void {
		this.imagePath = "";

		this.data = CHART_DATA_QUARTERS;
		this.borderColor = getComputedStyle(document.documentElement).getPropertyValue(
			"--ion-color-primary"
		);

		this.chartData = {
			datasets: [
				{
					data: this.data,
					borderColor: this.borderColor,
					backgroundColor: ["#f00", "#ff0", "#0f0", "#00f"],
					hoverBackgroundColor: ["#f00", "#ff0", "#0f0", "#00f"],
					hoverBorderColor: ["#f00", "#ff0", "#0f0", "#00f"],
				},
			],
		};

		this.chartOptions = {
			cutout: "50%",
			responsive: false,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					display: false,
				},
				tooltip: {
					enabled: false,
				},
			},
		};
	}

	protected onImageUploaded(image: { imagePath: string }): void {
		this.imagePath = image?.imagePath;
	}

	protected isMobile(): boolean {
		const currentPlatform = Capacitor.getPlatform();
		return currentPlatform !== "web";
	}
}
