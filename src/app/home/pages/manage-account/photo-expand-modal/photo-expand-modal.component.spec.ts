import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";
import { PhotoExpandModalComponent } from "./photo-expand-modal.component";

describe("PhotoExpandModalComponent", () => {
	let component: PhotoExpandModalComponent;
	let fixture: ComponentFixture<PhotoExpandModalComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [PhotoExpandModalComponent],
			imports: [IonicModule.forRoot()],
		}).compileComponents();

		fixture = TestBed.createComponent(PhotoExpandModalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
