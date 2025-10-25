import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, filter, first, Observable, of, tap } from "rxjs";
import { Filesystem } from "@capacitor/filesystem";
import { Progress, UploadService } from "./upload.service";
import { Camera, CameraResultType, CameraSource, Photo } from "@capacitor/camera";

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
	}

	public async takePhoto(): Promise<Blob> {
		return this.getCameraPhoto(CameraSource.Camera);
	}

	public async openPhotoLibrary(): Promise<Blob> {
		return this.getCameraPhoto(CameraSource.Photos);
	}

	public discardPhoto(): void {
		this.imageUrlInternal$.next("");
		this.imageModifiedInternal$.next(true);
		this.uploadProgressInternal$.next(null);

		if (this.currentPhoto) {
			void Filesystem.deleteFile({ path: this.currentPhoto.path });
			this.currentPhoto = null;
		}
	}

	public uploadPhoto(blob: Blob) {
		this.uploadProgressInternal$.next(null);
		this.imageModifiedInternal$.next(true);

		return this.uploadService.uploadFile(blob, "image").pipe(
			tap((progress) => this.uploadProgressInternal$.next(progress)),
			catchError((err) => {
				console.log("Failed");
				return of(err);
			}),
			filter((progress) => progress?.percentage === 100 && !!progress?.imagePath),
			tap(() => {
				console.log("Failed");
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

		this.imageUrlInternal$.next(image.webPath);
		this.currentPhoto = image;

		const response = await fetch(image.webPath);
		return response.blob();
	}
}
