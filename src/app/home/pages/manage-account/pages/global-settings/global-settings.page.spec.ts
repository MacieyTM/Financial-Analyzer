import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GlobalSettingsPage } from "./global-settings.page";

describe("GlobalSettingsPage", () => {
	let component: GlobalSettingsPage;
	let fixture: ComponentFixture<GlobalSettingsPage>;

	beforeEach(() => {
		fixture = TestBed.createComponent(GlobalSettingsPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
