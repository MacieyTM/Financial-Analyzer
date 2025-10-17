import { Injectable } from "@angular/core";
// import { Camera, CameraResultType, CameraSource, Photo } from "@capacitor/camera";
// import { Filesystem } from "@capacitor/filesystem";
import { BehaviorSubject, catchError, filter, first, Observable, of, tap } from "rxjs";
// import { FileUploadService, Progress } from "src/app/api/file/file-upload.service";

const IMAGE_QUALITY = 80;

@Injectable()
export class PhotoService {
	// public uploadProgress$: Observable<Progress>;
	// public cameraOrGalleryOpened$: Observable<boolean>;
	// public imageUrl$: Observable<string[]>;
	// public imageUrlSingle$: Observable<string>;
	// public imageModified$: Observable<boolean>;

	// private readonly uploadProgressInternal$ = new BehaviorSubject<Progress>(null);
	// private readonly cameraOrGalleryOpenedInternal$ = new BehaviorSubject<boolean>(false);
	// private readonly imageUrlInternal$ = new BehaviorSubject<string[]>([]);
	// private readonly imageUrlInternalSingle$ = new BehaviorSubject<string>("");
	// private readonly imageModifiedInternal$ = new BehaviorSubject<boolean>(false);

	// private currentPhoto: Photo[] = [];
	// private currentPhotoSingle: Photo = null;

	// constructor(
	// 	private readonly fileUploadService: FileUploadService,
	// 	private readonly store: Store
	// ) {
	// 	this.uploadProgress$ = this.uploadProgressInternal$.asObservable();
	// 	this.cameraOrGalleryOpened$ = this.cameraOrGalleryOpenedInternal$.asObservable();
	// 	this.imageUrl$ = this.imageUrlInternal$.asObservable();
	// 	this.imageUrlSingle$ = this.imageUrlInternalSingle$.asObservable();
	// 	this.imageModified$ = this.imageModifiedInternal$.asObservable();
	// }

	// public async takePhoto(): Promise<Blob> {
	// 	return this.getCameraPhoto(CameraSource.Camera);
	// }

	// public async takePhotoSingle(): Promise<Blob> {
	// 	return this.getCameraPhotoSingle(CameraSource.Camera);
	// }

	// public async openPhotoLibrary(): Promise<Blob> {
	// 	return this.getCameraPhoto(CameraSource.Photos);
	// }

	// public async openPhotoLibrarySingle(): Promise<Blob> {
	// 	return this.getCameraPhotoSingle(CameraSource.Photos);
	// }

	// public discardPhoto(index: number): void {
	// 	const current = this.imageUrlInternal$.value;

	// 	if (current[index]) {
	// 		const photoToRemove = this.currentPhoto[index];
	// 		if (photoToRemove?.path) {
	// 			void Filesystem.deleteFile({ path: photoToRemove.path });
	// 		}
	// 		this.currentPhoto.splice(index, 1);
	// 	}

	// 	this.imageUrlInternal$.next(current.filter((_, i) => i !== index));
	// 	this.imageModifiedInternal$.next(true);
	// 	this.uploadProgressInternal$.next(null);
	// }

	// public discardPhotoSingle(): void {
	// 	this.imageUrlInternalSingle$.next("");
	// 	this.imageModifiedInternal$.next(true);
	// 	this.uploadProgressInternal$.next(null);

	// 	if (this.currentPhotoSingle) {
	// 		void Filesystem.deleteFile({ path: this.currentPhotoSingle.path });
	// 		this.currentPhotoSingle = null;
	// 	}
	// }

	// public uploadPhoto(blob: Blob) {
	// 	this.uploadProgressInternal$.next(null);
	// 	this.imageModifiedInternal$.next(true);

	// 	return this.fileUploadService.uploadFile(blob, `mobile-${Date.now().toString()}.jpeg`).pipe(
	// 		tap((progress) => this.uploadProgressInternal$.next(progress)),
	// 		catchError((err) => {
	// 			this.store.dispatch(
	// 				showErrorToast({
	// 					message: "Failed to upload photo",
	// 					translationKey: "toasts.failed_to_upload_photo",
	// 				})
	// 			);
	// 			return of(err);
	// 		}),
	// 		filter((progress) => progress?.percentage === 100 && !!progress?.imagePath),
	// 		tap(() => {
	// 			this.store.dispatch(
	// 				showSuccessToast({
	// 					message: "Photo uploaded successfully",
	// 					translationKey: "toasts.photo_uploaded_successfully",
	// 				})
	// 			);
	// 		}),
	// 		first()
	// 	);
	// }

	// private async getCameraPhoto(source: CameraSource): Promise<Blob> {
	// 	await Camera.requestPermissions();

	// 	this.cameraOrGalleryOpenedInternal$.next(true);
	// 	const image = await Camera.getPhoto({
	// 		quality: IMAGE_QUALITY,
	// 		source,
	// 		resultType: CameraResultType.Uri,
	// 		saveToGallery: true,
	// 	});

	// 	const current = this.imageUrlInternal$.value;

	// 	this.imageUrlInternal$.next([...current, image.webPath]);
	// 	this.currentPhoto.push(image);

	// 	const response = await fetch(image.webPath);
	// 	return response.blob();
	// }

	// private async getCameraPhotoSingle(source: CameraSource): Promise<Blob> {
	// 	await Camera.requestPermissions();

	// 	this.cameraOrGalleryOpenedInternal$.next(true);
	// 	const image = await Camera.getPhoto({
	// 		quality: IMAGE_QUALITY,
	// 		source,
	// 		resultType: CameraResultType.Uri,
	// 		saveToGallery: true,
	// 	});

	// 	this.imageUrlInternalSingle$.next(image.webPath);
	// 	this.currentPhotoSingle = image;

	// 	const response = await fetch(image.webPath);
	// 	return response.blob();
	// }
}
