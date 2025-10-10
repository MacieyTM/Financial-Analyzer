import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LanguageSettingsPage } from "./language-settings.page";

describe("LanguageSettingsPage", () => {
	let component: LanguageSettingsPage;
	let fixture: ComponentFixture<LanguageSettingsPage>;

	beforeEach(() => {
		fixture = TestBed.createComponent(LanguageSettingsPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
