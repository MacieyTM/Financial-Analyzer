import { ComponentFixture, TestBed } from "@angular/core/testing";
import { KpiTrendsPage } from "./kpi-trends.page";

describe("KpiTrendsPage", () => {
	let component: KpiTrendsPage;
	let fixture: ComponentFixture<KpiTrendsPage>;

	beforeEach(() => {
		fixture = TestBed.createComponent(KpiTrendsPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
