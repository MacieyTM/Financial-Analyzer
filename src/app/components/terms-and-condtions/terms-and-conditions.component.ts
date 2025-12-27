import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
	selector: "app-terms-and-conditions",
	templateUrl: "./terms-and-conditions.component.html",
	styleUrls: ["./terms-and-conditions.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermsAndConditionsComponent {
	form: FormGroup;

	constructor(
		private dialogRef: MatDialogRef<TermsAndConditionsComponent>,
		private fb: FormBuilder
	) {
		this.form = this.fb.group({
			acceptTerms: [false, Validators.requiredTrue],
			acceptCookies: [false, Validators.requiredTrue],
		});
	}

	protected declineAndExit(): void {
		this.dialogRef.close();
		navigator["app"].exitApp();
	}

	protected acceptAndContinue(): void {
		if (this.form.valid) {
			localStorage.setItem("firstLaunchDone", "true");
			this.dialogRef.close();
		}
	}
}
