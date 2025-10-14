import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
	selector: "app-right",
	templateUrl: "./right.page.html",
	styleUrls: ["./right.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RightPage {}
