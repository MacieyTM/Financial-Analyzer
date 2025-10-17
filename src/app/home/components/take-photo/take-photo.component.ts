import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Output,
	signal,
} from "@angular/core";
import { BehaviorSubject, catchError, map, Observable, of, skip, Subscription, tap } from "rxjs";
import { PhotoService } from "src/app/services/photo.service";

@Component({
	selector: "app-take-photo",
	templateUrl: "./take-photo.component.html",
	styleUrls: ["./take-photo.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TakePhotoComponent implements OnInit, OnDestroy {
	@Output() feedbackImageUploaded = new EventEmitter<{
		imagePath: string;
		isPhotoUploading: boolean;
	}>();

	@Input() defaultImageUrl: string;

	public readonly isExpandPhotoModalOpen = signal(false);
	public imageModified$ = this.photoService.imageModified$;
	public imageUrl$ = this.photoService.imageUrl$;
	public isModalOpen$: Observable<boolean>;
	public photoBlob = signal<Blob>(null);
	public isError = signal(false);

	public uploadProgress$ = this.photoService.uploadProgress$.pipe(
		tap((progress) => {
			if (progress?.imagePath) {
				this.feedbackImageUploaded.emit({
					imagePath: progress.imagePath,
					isPhotoUploading: false,
				});
			}
		}),
		map((progress) => (progress?.percentage != null ? progress.percentage / 100 : 0))
	);

	private readonly isModalOpenInternal$ = new BehaviorSubject<boolean>(false);
	private subscription: Subscription;

	constructor(private readonly photoService: PhotoService) {
		this.isModalOpen$ = this.isModalOpenInternal$.asObservable();
	}

	public onDismissExpandPhotoModal(): void {
		this.isExpandPhotoModalOpen.set(false);
	}

	public async reUpload(): Promise<void> {
		this.isError.set(false);
		this.photoService
			.uploadPhoto(this.photoBlob())
			.pipe(
				catchError((err) => {
					this.isError.set(true);
					return of(err);
				})
			)
			.subscribe();
	}

	public ngOnInit(): void {
		this.isModalOpenInternal$.next(false);

		this.subscription = this.photoService.cameraOrGalleryOpened$
			.pipe(
				skip(1),
				tap((opened) => this.isModalOpenInternal$.next(!opened))
			)
			.subscribe();
	}

	public ngOnDestroy(): void {
		this.subscription?.unsubscribe();
	}

	public onModalDismiss(): void {
		this.isModalOpenInternal$.next(false);
	}

	public openModal(): void {
		this.isModalOpenInternal$.next(true);
	}

	public removePhoto(): void {
		this.photoService.discardPhoto();
		this.isError.set(false);

		this.feedbackImageUploaded.emit({
			imagePath: "",
			isPhotoUploading: false,
		});
		// this.feedbackImageUploaded.emit(null);
	}

	public async upload(): Promise<void> {
		const blob = await this.photoService.takePhoto();
		this.photoBlob.set(blob);
		this.feedbackImageUploaded.emit({
			imagePath: "",
			isPhotoUploading: true,
		});
		this.photoService
			.uploadPhoto(blob)
			.pipe(
				catchError((err) => {
					this.isError.set(true);
					return of(err);
				})
			)
			.subscribe();
	}

	public async openPhotoLibrarySingle(): Promise<void> {
		const blob = await this.photoService.openPhotoLibrary();
		this.feedbackImageUploaded.emit({
			imagePath: "",
			isPhotoUploading: true,
		});
		this.photoService
			.uploadPhoto(blob)
			.pipe(
				catchError((err) => {
					this.isError.set(true);
					return of(err);
				})
			)
			.subscribe();
	}
}
