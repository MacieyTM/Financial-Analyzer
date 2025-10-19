import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Storage } from "@ionic/storage-angular";

export interface Progress {
	percentage: number;
	imagePath?: string;
}

@Injectable({
	providedIn: "root",
})
export class UploadService {
	private isReady: Promise<void>;

	constructor(private readonly storage: Storage) {
		this.isReady = this.storage.create().then(() => {});
	}

	public uploadFile(blob: Blob, filename: string): Observable<Progress> {
		return new Observable((observer) => {
			let percentage = 0;

			const progressInterval = setInterval(async () => {
				percentage = Math.min(percentage + Math.random() * 30, 100);
				observer.next({ percentage } as Progress);

				if (percentage >= 100) {
					clearInterval(progressInterval);

					const reader = new FileReader();
					reader.onloadend = async () => {
						const base64File = reader.result as string;

						await this.isReady;
						await this.storage.set(filename, base64File);

						observer.next({
							percentage: 100,
							imagePath: filename,
						} as Progress);

						observer.complete();
					};
					reader.readAsDataURL(blob);
				}
			}, 500);
		});
	}

	public getImage(filename: string): Observable<Blob> {
		return new Observable((observer) => {
			(async () => {
				await this.isReady;
				const base64Image = await this.storage.get(filename);

				if (base64Image) {
					try {
						const byteCharacters = atob(base64Image.split(",")[1]);
						const byteArrays = new Uint8Array(byteCharacters.length);

						for (let i = 0; i < byteCharacters.length; i++) {
							byteArrays[i] = byteCharacters.charCodeAt(i);
						}

						const blob = new Blob([byteArrays], { type: "image/jpeg" });
						observer.next(blob);
						observer.complete();
					} catch {
						observer.error("Error decoding image from storage");
					}
				} else {
					observer.error("Image not found in Storage");
				}
			})().catch((err) => observer.error(err));

			return () => {};
		});
	}
}
