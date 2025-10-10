import { TestBed } from "@angular/core/testing";
import { AppTranslateService } from "./translate.service";

describe("AppTranslateService", () => {
	let service: AppTranslateService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(AppTranslateService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
