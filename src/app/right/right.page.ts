import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
	selector: "app-right",
	templateUrl: "./right.page.html",
	styleUrls: ["./right.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RightPage implements OnInit {
	constructor() {}

	ngOnInit() {}
}
