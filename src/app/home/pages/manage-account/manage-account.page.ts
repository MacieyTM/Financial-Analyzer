import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
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

	constructor(
		protected readonly photoService: PhotoService,
		private readonly cdr: ChangeDetectorRef
	) {}

	public async ngOnInit(): Promise<void> {
		await this.photoService.loadSaved();

		this.isLocalStorageUserFullName = !!localStorage.getItem("userFullName");
		this.userFullName = localStorage.getItem("userFullName") || "";

		this.cdr.detectChanges();
	}

	protected alert(): void {
		alert("Not implemented yet!");
	}
}
