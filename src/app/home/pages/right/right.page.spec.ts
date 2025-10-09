import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RightPage } from "./right.page";

describe("RightPage", () => {
	let component: RightPage;
	let fixture: ComponentFixture<RightPage>;

	beforeEach(() => {
		fixture = TestBed.createComponent(RightPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
