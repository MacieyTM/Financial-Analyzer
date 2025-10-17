import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { ChartOptions, ChartData } from "chart.js";
import { ScreenOrientation, OrientationType } from "@capawesome/capacitor-screen-orientation";
import { Capacitor } from "@capacitor/core";
import { DATA } from "src/app/models/chart.model";

const BANK_ACCOUNT_AMOUNT: number = 1234567.89;

@Component({
	selector: "app-home",
	templateUrl: "home.page.html",
	styleUrls: ["home.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
	protected readonly bankAccountAmount = signal<string>(BANK_ACCOUNT_AMOUNT.toLocaleString());
	protected chartData: ChartData<"doughnut">;
	protected chartOptions: ChartOptions<"doughnut">;

	private data: number[];
	private borderColor: string;

	public ngOnInit(): void {
		this.data = DATA;
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
			// cutout: "85%",
			plugins: {
				legend: {
					display: false,
					position: "bottom",
				},
				tooltip: {
					enabled: false,
				},
			},
			maintainAspectRatio: false,
			responsive: true,
		};
	}
}
