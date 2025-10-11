import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";

@Component({
	selector: "app-user-settings",
	templateUrl: "./user-settings.page.html",
	styleUrls: ["./user-settings.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsPage implements OnInit {
	public userName!: string;
	public userSurname!: string;

	constructor(private readonly navController: NavController) {}

	ngOnInit() {
		this.userName = "";
		this.userSurname = "";
		const storedFullName = localStorage.getItem("userFullName");

		if (storedFullName) {
			const [name, surName] = storedFullName.split(" ");

			this.userName = name || "";
			this.userSurname = surName || "";
		}
	}

	protected save(name: string, surname: string) {
		const fullUserName = `${name} ${surname}`;

		localStorage.setItem("userFullName", fullUserName);
		this.navController.navigateBack("home");
	}
}
