import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
	selector: "app-manage-account",
	templateUrl: "./manage-account.page.html",
	styleUrls: ["./manage-account.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageAccountPage implements OnInit {
	public isLocalStorageUserFullName!: boolean;
	public userFullName!: string;

	constructor() {}

	ngOnInit() {
		this.isLocalStorageUserFullName = !!localStorage.getItem("userFullName");
		this.userFullName = localStorage.getItem("userFullName") || "";
	}

	alert() {
		alert("Not implemented yet!");
	}
}
