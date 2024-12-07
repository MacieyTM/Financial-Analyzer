import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ManageAccountPage } from "./manage-account.page";

describe("ManageAccountPage", () => {
	let component: ManageAccountPage;
	let fixture: ComponentFixture<ManageAccountPage>;

	beforeEach(() => {
		fixture = TestBed.createComponent(ManageAccountPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
