import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { ChartOptions, ChartData } from "chart.js";
import { ScreenOrientation, OrientationType } from "@capawesome/capacitor-screen-orientation";
import { Capacitor } from "@capacitor/core";
import { DATA, LABEL_MONTHS } from "src/app/models/chart.model";

const BANK_ACCOUNT_AMOUNT: number = 1234567.89;

@Component({
	selector: "app-home",
	templateUrl: "home.page.html",
	styleUrls: ["home.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
	protected readonly bankAccountAmount = signal<string>(BANK_ACCOUNT_AMOUNT.toLocaleString());
	protected chartData: ChartData;
	protected chartOptions: ChartOptions;

	private data: number[];
	private borderColor: string;
	private labelMonths: string[];

	public ngOnInit(): void {
		this.data = DATA;
		this.labelMonths = LABEL_MONTHS;
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
					label: "Money Amount",
				},
			],
		};

		this.chartOptions = {
			responsive: false,
		};
	}
}
