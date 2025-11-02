import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { AlertController, ModalController } from "@ionic/angular";
import { PhotoService, UserPhoto } from "src/app/services/photo.service";
import { PhotoExpandModalComponent } from "./photo-expand-modal/photo-expand-modal.component";

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
		private readonly alertController: AlertController,
		private readonly modalController: ModalController
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
					cssClass: "danger-btn",
					handler: async () => {
						await this.photoService.deletePicture(photo, position);
						this.cdr.detectChanges();
					},
				},
			],
		});

		await alert.present();
	}

	protected async openExpandModal(photo: UserPhoto): Promise<void> {
		const modal = await this.modalController.create({
			component: PhotoExpandModalComponent,
			componentProps: {
				photoUrl: photo.webviewPath,
			},
		});

		return await modal.present();
	}

	protected alert(): void {
		alert("Not implemented yet!");
	}
}
