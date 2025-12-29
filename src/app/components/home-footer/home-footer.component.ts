import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
	selector: "app-home-footer",
	templateUrl: "./home-footer.component.html",
	styleUrls: ["./home-footer.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeFooterComponent {
	protected readonly currentYear: number = new Date().getFullYear();
}
