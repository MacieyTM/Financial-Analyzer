import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Component({
	selector: "app-photo-expand-modal",
	templateUrl: "./photo-expand-modal.component.html",
	styleUrls: ["./photo-expand-modal.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoExpandModalComponent {
	@Input() photoUrl: string;

	constructor(private modalController: ModalController) {}

	protected close(): void {
		this.modalController.dismiss();
	}
}
