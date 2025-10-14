import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
	selector: "app-home-left",
	templateUrl: "./home-left.component.html",
	styleUrls: ["./home-left.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeLeftComponent {}
