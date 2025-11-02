import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
	selector: "app-home-header",
	templateUrl: "./home-header.component.html",
	styleUrls: ["./home-header.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeHeaderComponent {
	@Input() defaultHref: string;
	@Input() backButtonText = "";

	private _headerTitle: string;

	public get headerTitle(): string {
		return this._headerTitle;
	}

	@Input() set headerTitle(value: string) {
		this._headerTitle = value;
	}
}
