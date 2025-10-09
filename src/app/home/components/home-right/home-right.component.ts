import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
	selector: "app-home-right",
	templateUrl: "./home-right.component.html",
	styleUrls: ["./home-right.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeRightComponent implements OnInit {
	constructor() {}

	ngOnInit() {}
}
