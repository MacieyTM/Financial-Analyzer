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
import { BehaviorSubject, catchError, map, of, skip, Subscription, tap } from "rxjs";
import { PhotoService } from "src/app/services/photo.service";

@Component({
	selector: "app-take-photo",
	templateUrl: "./take-photo.component.html",
	styleUrls: ["./take-photo.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TakePhotoComponent implements OnInit, OnDestroy {
	@Output() imageUploaded = new EventEmitter<{
		imagePath: string;
		isPhotoUploading: boolean;
	}>();

	@Input() defaultImageUrl: string;

	public readonly isExpandPhotoModalOpen = signal(false);
	public storedImageFilename = signal<string>("");
	public imageModified$ = this.photoService.imageModified$;
	public imageUrl$ = this.photoService.imageUrl$;
	public photoBlob = signal<Blob>(null);
	public isError = signal(false);
	public isModalOpen$: BehaviorSubject<boolean> = new BehaviorSubject(false);

	public uploadProgress$ = this.photoService.uploadProgress$.pipe(
		tap((progress) => {
			if (progress?.imagePath) {
				this.storedImageFilename.set(progress.imagePath);
				this.imageUploaded.emit({
					imagePath: progress.imagePath,
					isPhotoUploading: false,
				});
			}
		}),
		map((progress) => (progress?.percentage != null ? progress.percentage / 100 : 0))
	);

	private subscription: Subscription;

	constructor(private readonly photoService: PhotoService) {}

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
		this.subscription = this.photoService.cameraOrGalleryOpened$
			.pipe(
				skip(1),
				tap((opened) => this.isModalOpen$.next(!opened))
			)
			.subscribe();
	}

	public ngOnDestroy(): void {
		this.subscription?.unsubscribe();
	}

	public onModalDismiss(): void {
		this.isModalOpen$.next(false);
	}

	public openModal(): void {
		this.isModalOpen$.next(true);
	}

	public removePhoto(): void {
		this.photoService.discardPhoto();
		this.isError.set(false);
		this.storedImageFilename.set("");

		this.imageUploaded.emit({
			imagePath: "",
			isPhotoUploading: false,
		});
		// this.feedbackImageUploaded.emit(null);
	}

	public async upload(): Promise<void> {
		const blob = await this.photoService.takePhoto();
		this.photoBlob.set(blob);
		this.imageUploaded.emit({
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
		this.imageUploaded.emit({
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
