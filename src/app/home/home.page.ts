import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { CHART_DATA_QUARTERS } from "src/app/models/chart.model";
import { PhotoService } from "../services/photo.service";
import { ChartConfiguration } from "chart.js";

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

	constructor(protected readonly photoService: PhotoService) {}

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

	protected addPhotoToStorage(): void {
		this.photoService.addNewToGallery();
	}
}
