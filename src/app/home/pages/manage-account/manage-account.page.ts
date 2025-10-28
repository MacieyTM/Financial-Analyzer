import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { AlertController } from "@ionic/angular";
import { PhotoService, UserPhoto } from "src/app/services/photo.service";

@Component({
	selector: "app-manage-account",
	templateUrl: "./manage-account.page.html",
	styleUrls: ["./manage-account.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageAccountPage implements OnInit {
	protected userFullName: string;
	protected isLocalStorageUserFullName: boolean;

	constructor(
		protected readonly photoService: PhotoService,
		private readonly cdr: ChangeDetectorRef,
		private readonly alertController: AlertController
	) {}

	public async ngOnInit(): Promise<void> {
		await this.photoService.loadSaved();

		this.isLocalStorageUserFullName = !!localStorage.getItem("userFullName");
		this.userFullName = localStorage.getItem("userFullName") || "";

		this.cdr.detectChanges();
	}

	protected async deletePhoto(photo: UserPhoto, position: number): Promise<void> {
		const alert = await this.alertController.create({
			header: "Delete Photo",
			message: "Are you sure you want to delete this photo?",
			buttons: [
				{
					text: "Cancel",
					role: "cancel",
				},
				{
					text: "Delete",
					role: "destructive",
					handler: async () => {
						await this.photoService.deletePicture(photo, position);
						this.cdr.detectChanges();
					},
				},
			],
		});

		await alert.present();
	}

	protected alert(): void {
		alert("Not implemented yet!");
	}
}
