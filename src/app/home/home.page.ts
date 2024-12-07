import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
	selector: "app-home",
	templateUrl: "home.page.html",
	styleUrls: ["home.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage implements OnInit {
	protected readonly bankAccountAmount: number = 1234567.89;

	constructor() {}

	protected get bankAccountAmountFormatted(): string {
		return this.bankAccountAmount.toLocaleString();
	}

	ngOnInit() {}
}
