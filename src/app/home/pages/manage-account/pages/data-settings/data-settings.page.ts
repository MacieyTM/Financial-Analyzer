import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { AlertController, NavController, ToastController } from "@ionic/angular";
import { AppTranslatePipe } from "src/app/pipes/translate.pipe";

@Component({
	selector: "app-data-settings",
	templateUrl: "./data-settings.page.html",
	styleUrls: ["./data-settings.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataSettingsPage implements OnInit, OnDestroy {
	private chartTypeChanged: boolean;

	constructor(
		private readonly navController: NavController,
		private readonly toastController: ToastController,
		private readonly translatePipe: AppTranslatePipe,
		private readonly alertController: AlertController
	) {}

	public ngOnInit(): void {
		this.chartTypeChanged = false;
	}

	public ngOnDestroy(): void {
		if (this.chartTypeChanged) {
			this.showSuccessToast();
		}
	}

	protected cancel(): void {
		this.navController.back();
	}

	protected openAlertDialog(): void {
		this.alertController
			.create({
				// header: this.translatePipe.transform("Confirm Clear", "confirm_clear"),
				// message: this.translatePipe.transform(
				// 	"Are you sure you want to clear all data and user settings?",
				// 	"are_you_sure_clear"
				// ),
				header: "Confirm Clear",
				message: "Are you sure you want to clear all data and user settings?",
				buttons: [
					// {
					// 	text: this.translatePipe.transform("Cancel", "cancel"),
					// 	role: "cancel",
					// },
					// {
					// 	text: this.translatePipe.transform("Clear", "clear"),
					// 	handler: () => this.clear(),
					// },
					{
						text: "Cancel",
						role: "cancel",
					},
					{
						text: "Clear",
						handler: () => this.clear(),
					},
				],
			})
			.then((alert) => alert.present());
	}

	private clear(): void {
		localStorage.clear();
		this.chartTypeChanged = true;
		this.navController.navigateBack("/home");
	}

	private async showSuccessToast(): Promise<void> {
		const toast = await this.toastController.create({
			// header: 'Success',
			// message: this.translatePipe.transform(
			// 	"Chart data type changed successfully!",
			// 	"chart_data_type_changed_successfully"
			// ),
			message: "All data and user settings have been cleared successfully!",
			duration: 3000,
			color: "success",
			icon: "checkmark-circle",
		});
		toast.present();
	}
}
