import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EditDataSettingsPage } from "./edit-data-settings.page";

describe("DataSettingsPage", () => {
	let component: EditDataSettingsPage;
	let fixture: ComponentFixture<EditDataSettingsPage>;

	beforeEach(() => {
		fixture = TestBed.createComponent(EditDataSettingsPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
