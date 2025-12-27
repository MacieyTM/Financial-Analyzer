import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DataSettingsPage } from "./data-settings.page";

describe("DataSettingsPage", () => {
	let component: DataSettingsPage;
	let fixture: ComponentFixture<DataSettingsPage>;

	beforeEach(() => {
		fixture = TestBed.createComponent(DataSettingsPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
