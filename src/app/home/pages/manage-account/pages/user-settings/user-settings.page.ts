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
			const nicknameStart = storedFullName.indexOf("(");
			const nicknameEnd = storedFullName.indexOf(")");

			if (nicknameStart !== -1 && nicknameEnd !== -1) {
				this.userName = storedFullName.substring(0, storedFullName.indexOf(" "));
				this.userSurname = storedFullName.substring(this.userName.length + 1, nicknameStart).trim();
				this.userNick = storedFullName.substring(nicknameStart + 1, nicknameEnd);
			} else {
				const [name, surname] = storedFullName.split(" ");
				this.userName = name || "";
				this.userSurname = surname || "";
			}
		}
	}

	protected cancel() {
		this.navController.back();
	}

	protected isButtonDisabled(): boolean {
		const name = this.userName.trim().length === 0;
		const surname = this.userSurname.trim().length === 0;
		const nick = this.userNick.trim().length === 0;

		if (this.userNick.includes("(") || this.userNick.includes(")")) {
			return true;
		}

		return name && surname && nick;
	}

	protected save(name: string, surname: string, nick: string) {
		const fullUserName = nick ? `${name} ${surname} (${nick})` : `${name} ${surname}`;

		localStorage.setItem("userFullName", fullUserName);
		this.navController.navigateBack("home");
	}
}
