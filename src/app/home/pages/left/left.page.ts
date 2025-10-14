import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
	selector: "app-left",
	templateUrl: "./left.page.html",
	styleUrls: ["./left.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeftPage {}
