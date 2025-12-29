import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { Capacitor } from "@capacitor/core";

const EXIT_URL: string = "https://www.google.com";

@Component({
	selector: "app-terms-and-conditions",
	templateUrl: "./terms-and-conditions.component.html",
	styleUrls: ["./terms-and-conditions.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermsAndConditionsComponent {
	form: FormGroup;

	constructor(
		private fb: FormBuilder,
		private dialogRef: MatDialogRef<TermsAndConditionsComponent>
	) {
		this.form = this.fb.group({
			acceptTerms: [false, Validators.requiredTrue],
			acceptCookies: [false, Validators.requiredTrue],
		});
	}

	protected declineAndExit(): void {
		this.dialogRef.close();
		if (Capacitor.getPlatform() !== "web") {
			navigator["app"].exitApp();
		} else {
			window.location.href = EXIT_URL;
		}
	}

	protected acceptAndContinue(): void {
		if (this.form.valid) {
			localStorage.setItem("firstLaunchDone", "true");
			this.dialogRef.close();
		}
	}
}
