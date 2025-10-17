import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
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

	public ngOnInit(): void {
		this.data = CHART_DATA_QUARTERS;
		this.borderColor = getComputedStyle(document.documentElement).getPropertyValue(
			"--ion-color-primary"
		);

		this.chartData = {
			datasets: [
				{
					data: this.data,
					borderColor: this.borderColor,
					backgroundColor: ["#f00", "#f00", "#f00", "#f00"],
					hoverBackgroundColor: ["#f00", "#f00", "#f00", "#f00"],
					hoverBorderColor: ["#f00", "#f00", "#f00", "#f00"],
					borderWidth: 3,
					borderRadius: 15,
					spacing: 4,
				},
			],
		};

		this.chartOptions = {
			cutout: "85%",
			responsive: false,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					display: false,
					position: "bottom",
				},
				tooltip: {
					enabled: false,
				},
			},
		};
	}
}
