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
	public userNick!: string;

	constructor(private readonly navController: NavController) {}

	ngOnInit() {
		this.userName = "";
		this.userSurname = "";
		this.userNick = "";

		const storedFullName = localStorage.getItem("userFullName");

		if (storedFullName) {
			const [name, surname, nick] = storedFullName.split(" ");

			this.userName = name || "";
			this.userSurname = surname || "";
			this.userNick = nick || "";
		}
	}

	protected cancel() {
		this.navController.back();
	}

	protected isButtonDisabled(): boolean {
		const name = this.userName.trim().length === 0;
		const surname = this.userSurname.trim().length === 0;
		const nick = this.userNick.trim().length === 0;

		return name && surname && nick;
	}

	protected save(name: string, surname: string, nick: string) {
		const fullUserName = `${name} ${surname} (${nick})`;

		localStorage.setItem("userFullName", fullUserName);
		this.navController.navigateBack("home");
	}
}
