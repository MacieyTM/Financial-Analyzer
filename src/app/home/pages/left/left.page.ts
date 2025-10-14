import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
	selector: "app-left",
	templateUrl: "./left.page.html",
	styleUrls: ["./left.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeftPage implements OnInit {
	public constructor() {}
	public ngOnInit(): void {}
}
