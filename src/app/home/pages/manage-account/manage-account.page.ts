import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
	selector: "app-manage-account",
	templateUrl: "./manage-account.page.html",
	styleUrls: ["./manage-account.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageAccountPage implements OnInit {
	protected userFullName: string;
	protected isLocalStorageUserFullName: boolean;

	public constructor() {}

	public ngOnInit(): void {
		this.isLocalStorageUserFullName = !!localStorage.getItem("userFullName");
		this.userFullName = localStorage.getItem("userFullName") || "";
	}

	protected alert(): void {
		alert("Not implemented yet!");
	}
}
