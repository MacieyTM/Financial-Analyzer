import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { NavController, ToastController } from "@ionic/angular";
import { AppTranslatePipe } from "src/app/pipes/translate.pipe";

const originalUserData = {
	name: "",
	surname: "",
	nick: "",
};

@Component({
	selector: "app-user-settings",
	templateUrl: "./user-settings.page.html",
	styleUrls: ["./user-settings.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsPage implements OnInit {
	protected userName: string;
	protected userSurname: string;
	protected userNick: string;

	private userSettingsChanged: boolean;
	private originalUserData = originalUserData;

	public constructor(
		private readonly navController: NavController,
		private readonly toastController: ToastController,
		private readonly translatePipe: AppTranslatePipe
	) {}

	public ngOnInit(): void {
		this.userSettingsChanged = false;

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

		this.originalUserData = {
			name: this.userName,
			surname: this.userSurname,
			nick: this.userNick,
		};
	}

	public ngOnDestroy(): void {
		if (this.userSettingsChanged) {
			this.showSuccessToast();
		}
	}

	protected cancel(): void {
		this.navController.back();
	}

	protected isButtonDisabled(): boolean {
		const name = this.userName.trim().length === 0;
		const surname = this.userSurname.trim().length === 0;
		const nick = this.userNick.trim().length === 0;

		if (this.userNick.includes("(") || this.userNick.includes(")")) {
			return true;
		}

		const unchanged =
			JSON.stringify({
				name: this.userName,
				surname: this.userSurname,
				nick: this.userNick,
			}) === JSON.stringify(this.originalUserData);

		const startsWithSpace =
			this.userName.startsWith(" ") ||
			this.userSurname.startsWith(" ") ||
			this.userNick.startsWith(" ");

		return (name && surname && nick) || unchanged || startsWithSpace;
	}

	protected save(name: string, surname: string, nick: string): void {
		const fullUserName = nick ? `${name} ${surname} (${nick})` : `${name} ${surname}`;

		localStorage.setItem("userFullName", fullUserName);
		this.userSettingsChanged = true;
		this.navController.navigateBack("home");
	}

	private async showSuccessToast(): Promise<void> {
		const toast = await this.toastController.create({
			message: this.translatePipe.transform(
				"User details saved successfully!",
				"user_details_saved_successfully"
			),
			duration: 3000,
			color: "success",
			icon: "checkmark-circle",
		});
		toast.present();
	}
}
