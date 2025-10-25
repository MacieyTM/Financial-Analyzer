import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { TakePhotoComponent } from "./take-photo.component";

describe("TakePhotoComponent", () => {
	let component: TakePhotoComponent;
	let fixture: ComponentFixture<TakePhotoComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [TakePhotoComponent],
			imports: [IonicModule.forRoot()],
		}).compileComponents();

		fixture = TestBed.createComponent(TakePhotoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
