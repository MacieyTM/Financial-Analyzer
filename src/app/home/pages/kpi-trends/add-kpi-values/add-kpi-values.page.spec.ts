import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AddKpiValuesPage } from "./add-kpi-values.page";

describe("AddKpiValuesPage", () => {
	let component: AddKpiValuesPage;
	let fixture: ComponentFixture<AddKpiValuesPage>;

	beforeEach(() => {
		fixture = TestBed.createComponent(AddKpiValuesPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
