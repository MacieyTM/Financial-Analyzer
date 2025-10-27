import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, filter, first, Observable, of, tap } from "rxjs";
import { Camera, CameraResultType, CameraSource, Photo } from "@capacitor/camera";
import { Filesystem } from "@capacitor/filesystem";
import { UploadService, Progress } from "./upload.service";
import { Preferences } from "@capacitor/preferences";

const IMAGE_QUALITY = 80;

@Injectable({
	providedIn: "root",
})
export class PhotoService {
	public uploadProgress$: Observable<Progress>;
	public cameraOrGalleryOpened$: Observable<boolean>;
	public imageUrl$: Observable<string>;
	public imageModified$: Observable<boolean>;

	private readonly uploadProgressInternal$ = new BehaviorSubject<Progress>(null);
	private readonly cameraOrGalleryOpenedInternal$ = new BehaviorSubject<boolean>(false);
	private readonly imageUrlInternal$ = new BehaviorSubject<string>("");
	private readonly imageModifiedInternal$ = new BehaviorSubject<boolean>(false);

	private currentPhoto: Photo = null;

	constructor(private readonly uploadService: UploadService) {
		this.uploadProgress$ = this.uploadProgressInternal$.asObservable();
		this.cameraOrGalleryOpened$ = this.cameraOrGalleryOpenedInternal$.asObservable();
		this.imageUrl$ = this.imageUrlInternal$.asObservable();
		this.imageModified$ = this.imageModifiedInternal$.asObservable();
		this.loadSavedImage();
	}

	public async takePhoto(): Promise<Blob> {
		return this.getCameraPhoto(CameraSource.Camera);
	}

	public async openPhotoLibrary(): Promise<Blob> {
		return this.getCameraPhoto(CameraSource.Photos);
	}

	public async discardPhoto(): Promise<void> {
		this.imageUrlInternal$.next("");
		this.imageModifiedInternal$.next(true);
		this.uploadProgressInternal$.next(null);

		await Preferences.remove({ key: "last_uploaded_image" });

		if (this.currentPhoto?.path) {
			await Filesystem.deleteFile({ path: this.currentPhoto.path }).catch(() => {});
			this.currentPhoto = null;
		}
	}
	public uploadPhoto(blob: Blob): Observable<Progress> {
		this.uploadProgressInternal$.next(null);
		this.imageModifiedInternal$.next(true);

		// Generate a unique filename if needed
		const filename = `image_${Date.now()}.jpg`;

		return this.uploadService.uploadFile(blob, filename).pipe(
			tap((progress) => this.uploadProgressInternal$.next(progress)),
			catchError((err) => {
				console.error("Upload failed", err);
				return of(err);
			}),
			filter((progress) => progress?.percentage === 100 && !!progress?.imagePath),
			tap(async (progress) => {
				const fileData = await this.uploadService.getFile(progress.imagePath);
				if (fileData) {
					this.imageUrlInternal$.next(fileData); // data URL string
				}
			}),
			first()
		);
	}

	private async getCameraPhoto(source: CameraSource): Promise<Blob> {
		await Camera.requestPermissions();
		this.cameraOrGalleryOpenedInternal$.next(true);

		const image = await Camera.getPhoto({
			quality: IMAGE_QUALITY,
			source,
			resultType: CameraResultType.Uri,
			saveToGallery: true,
		});

		this.currentPhoto = image;
		this.imageUrlInternal$.next(image.webPath);

		const response = await fetch(image.webPath);
		return response.blob();
	}

	private async loadSavedImage(): Promise<void> {
		const { value: savedFilename } = await Preferences.get({ key: "last_uploaded_image" });
		if (savedFilename) {
			const fileData = await this.uploadService.getFile(savedFilename);
			if (fileData) {
				this.imageUrlInternal$.next(fileData); // base64 data URL
			}
		}
	}
}
