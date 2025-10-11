import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";

@Component({
	selector: "app-user-settings",
	templateUrl: "./user-settings.page.html",
	styleUrls: ["./user-settings.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsPage implements OnInit {
	public userName: string = "";
	public userSurname: string = "";

	constructor(private readonly navController: NavController) {}

	ngOnInit() {
		// this.userName = localStorage.getItem("userFullName")?.split("");
		// this.userName = localStorage.getItem("userFullName");
		// if (this.userName) {
		// 	localStorage.setItem("userFullName", this.userName);
		// } else {
		// 	localStorage.getItem("userFullName");
		// }
	}

	protected save(name: string, surname: string) {
		const fullUserName = name + " " + surname;
		localStorage.setItem("userFullName", fullUserName);
		this.navController.back();
	}
}
