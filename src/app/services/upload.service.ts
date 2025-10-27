import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Preferences } from "@capacitor/preferences";

export interface Progress {
	percentage: number;
	imagePath?: string;
}

@Injectable({
	providedIn: "root",
})
export class UploadService {
	constructor() {}

	/** Uploads file (simulated) and stores persistently using Capacitor Filesystem */
	public uploadFile(blob: Blob, filename: string): Observable<Progress> {
		return new Observable((observer) => {
			let percentage = 0;

			const progressInterval = setInterval(async () => {
				percentage = Math.min(percentage + Math.random() * 30, 100);
				observer.next({ percentage } as Progress);

				if (percentage >= 100) {
					clearInterval(progressInterval);

					try {
						const base64File = await this.blobToBase64(blob);

						// Save the file persistently on the device
						await Filesystem.writeFile({
							path: filename,
							data: base64File.split(",")[1], // remove "data:image/jpeg;base64,"
							directory: Directory.Data,
						});

						await Preferences.set({
							key: "last_uploaded_image",
							value: filename,
						});

						observer.next({
							percentage: 100,
							imagePath: filename,
						} as Progress);

						observer.complete();
					} catch (err) {
						console.error("Error saving file:", err);
					}
				}
			}, 500);
		});
	}

	/** Reads the file from Capacitor Filesystem and returns base64 data URL */
	public async getFile(filename: string): Promise<string | null> {
		try {
			const result = await Filesystem.readFile({
				path: filename,
				directory: Directory.Data,
			});
			// Return the full data URL (so it can be used directly in <ion-img>)
			return `data:image/jpeg;base64,${result.data}`;
		} catch (err) {
			console.error("Error reading file:", err);
			return null;
		}
	}

	/** Deletes a file from the Filesystem */
	public async deleteFile(filename: string): Promise<void> {
		try {
			await Filesystem.deleteFile({
				path: filename,
				directory: Directory.Data,
			});
		} catch (err) {
			console.error("Error deleting file:", err);
		}
	}

	/** Converts a Blob to base64 */
	private blobToBase64(blob: Blob): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result as string);
			reader.onerror = reject;
			reader.readAsDataURL(blob);
		});
	}
}
