import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
	selector: "app-language-settings",
	templateUrl: "./language-settings.page.html",
	styleUrls: ["./language-settings.page.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSettingsPage implements OnInit {
	protected readonly options = [
		{ value: "en", label: "English" },
		{ value: "pl", label: "Polish" },
	];
	constructor() {}

	ngOnInit() {}
}
