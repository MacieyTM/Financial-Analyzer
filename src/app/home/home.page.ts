import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { AppTranslateService } from "../services/translate.service";

@Component({
	selector: "app-home",
	templateUrl: "home.page.html",
	styleUrls: ["home.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage implements OnInit {
	private readonly bankAccountAmount: number = 1234567.89;

	public constructor() {}

	protected get bankAccountAmountFormatted(): string {
		return this.bankAccountAmount.toLocaleString();
	}

	public ngOnInit(): void {}
}
