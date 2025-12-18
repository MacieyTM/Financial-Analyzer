import { Injectable } from "@angular/core";
import { Camera, CameraResultType, CameraSource, Photo } from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Preferences } from "@capacitor/preferences";
import { Capacitor } from "@capacitor/core";
import { ActionSheetController, ToastController } from "@ionic/angular";

export interface UserPhoto {
	filepath: string;
	webviewPath?: string;
}

const IMAGE_QUALITY = 80;

@Injectable({
	providedIn: "root",
})
export class PhotoService {
	public photos: UserPhoto[] = [];
	private PHOTO_STORAGE: string = "photos";

	constructor(
		private readonly actionSheetController: ActionSheetController,
		private readonly toastController: ToastController
	) {}

	public async addNewToGallery(): Promise<void> {
		if (this.isMobile()) {
			const actionSheet = await this.actionSheetController.create({
				header: "Choose a source",
				cssClass: "custom-action-sheet",
				buttons: [
					{
						icon: "camera",
						text: "Take a Photo",
						handler: async () => {
							await this.capturePhotoFromCamera();
						},
					},
					{
						icon: "images",
						text: "Choose from Gallery",
						handler: async () => {
							await this.capturePhotoFromGallery();
						},
					},
				],
			});
			await actionSheet.present();
		} else {
			await this.capturePhotoFromGallery();
		}
	}

	private async capturePhotoFromCamera(): Promise<void> {
		const capturedPhoto = await Camera.getPhoto({
			resultType: CameraResultType.Uri,
			source: CameraSource.Camera,
			quality: IMAGE_QUALITY,
		});

		const savedImageFile = await this.savePicture(capturedPhoto);
		this.photos.unshift(savedImageFile);

		Preferences.set({
			key: this.PHOTO_STORAGE,
			value: JSON.stringify(this.photos),
		});
	}

	private async capturePhotoFromGallery(): Promise<void> {
		const selectedPhoto = await Camera.getPhoto({
			resultType: CameraResultType.Uri,
			source: CameraSource.Photos,
			quality: IMAGE_QUALITY,
		});

		const savedImageFile = await this.savePicture(selectedPhoto);
		this.photos.unshift(savedImageFile);

		Preferences.set({
			key: this.PHOTO_STORAGE,
			value: JSON.stringify(this.photos),
		});
	}

	private async savePicture(photo: Photo): Promise<UserPhoto> {
		try {
			const base64Data = await this.readAsBase64(photo);

			const fileName = Date.now() + ".jpeg";
			const savedFile = await Filesystem.writeFile({
				path: fileName,
				data: base64Data,
				directory: Directory.Data,
			});

			let result: UserPhoto;

			if (this.isMobile()) {
				result = {
					filepath: savedFile.uri,
					webviewPath: Capacitor.convertFileSrc(savedFile.uri),
				};
			} else {
				result = {
					filepath: fileName,
					webviewPath: photo.webPath,
				};
			}

			this.showSuccessToastUpload();
			return result;
		} catch (error) {
			this.showErrorToastUpload();
			throw error;
		}
	}

	public async loadSaved(): Promise<void> {
		const { value } = await Preferences.get({ key: this.PHOTO_STORAGE });
		this.photos = (value ? JSON.parse(value) : []) as UserPhoto[];

		if (!this.isMobile()) {
			for (let photo of this.photos) {
				const readFile = await Filesystem.readFile({
					path: photo.filepath,
					directory: Directory.Data,
				});

				photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
			}
		}
	}

	public async deletePicture(photo: UserPhoto, position: number): Promise<void> {
		try {
			const filePath = this.getFileNameFromPath(photo.filepath);

			await Filesystem.deleteFile({
				path: filePath,
				directory: Directory.Data,
			});

			this.photos.splice(position, 1);

			await Preferences.set({
				key: this.PHOTO_STORAGE,
				value: JSON.stringify(this.photos),
			});

			this.showSuccessToastDelete();
		} catch (error) {
			this.showErrorToastDelete();
			throw error;
		}
	}

	private getFileNameFromPath(filePath: string): string {
		const fileName = filePath.split("/").pop();
		return fileName;
	}

	private async readAsBase64(photo: Photo): Promise<string | Blob> {
		if (this.isMobile()) {
			const file = await Filesystem.readFile({
				path: photo.path!,
			});

			return file.data;
		} else {
			const response = await fetch(photo.webPath!);
			const blob = await response.blob();

			return (await this.convertBlobToBase64(blob)) as string;
		}
	}

	private convertBlobToBase64 = (blob: Blob) =>
		new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onerror = reject;

			reader.onload = () => {
				resolve(reader.result);
			};

			reader.readAsDataURL(blob);
		});

	private isMobile(): boolean {
		const currentPlatform = Capacitor.getPlatform();
		return currentPlatform !== "web";
	}

	private async showSuccessToastUpload(): Promise<void> {
		const toast = await this.toastController.create({
			message: "Photo uploaded successfully!",
			duration: 3000,
			color: "success",
			icon: "checkmark-circle",
		});
		toast.present();
	}

	private async showSuccessToastDelete(): Promise<void> {
		const toast = await this.toastController.create({
			message: "Photo deleted successfully!",
			duration: 3000,
			color: "success",
			icon: "checkmark-circle",
		});
		toast.present();
	}

	private async showErrorToastUpload(): Promise<void> {
		const toast = await this.toastController.create({
			message: "Failed to upload a photo!",
			duration: 3000,
			color: "danger",
			icon: "close-circle",
		});
		toast.present();
	}

	private async showErrorToastDelete(): Promise<void> {
		const toast = await this.toastController.create({
			message: "Failed to delete a photo!",
			duration: 3000,
			color: "danger",
			icon: "close-circle",
		});
		toast.present();
	}
}
