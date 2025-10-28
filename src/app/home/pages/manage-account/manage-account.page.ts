import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { PhotoService } from "src/app/services/photo.service";

@Component({
	selector: "app-manage-account",
	templateUrl: "./manage-account.page.html",
	styleUrls: ["./manage-account.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageAccountPage implements OnInit {
	protected userFullName: string;
	protected isLocalStorageUserFullName: boolean;

	constructor(public photoService: PhotoService) {}

	public async ngOnInit(): Promise<void> {
		await this.photoService.loadSaved();
		this.isLocalStorageUserFullName = await !!localStorage.getItem("userFullName");
		this.userFullName = (await localStorage.getItem("userFullName")) || "";
	}

	protected alert(): void {
		alert("Not implemented yet!");
	}
}
