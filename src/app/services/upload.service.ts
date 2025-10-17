import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface Progress {
	percentage: number;
	imagePath?: string;
}

@Injectable({
	providedIn: "root",
})
export class UploadService {
	public uploadFile(blob: Blob, filename: string): Observable<Progress> {
		return new Observable((observer) => {
			const progressInterval = setInterval(() => {
				let percentage = 0;
				const storedFile = localStorage.getItem(filename);
				if (storedFile) {
					percentage = 100;
				} else {
					percentage = Math.min(100, Math.random() * 100);
				}

				observer.next({
					percentage,
				} as Progress);

				if (percentage === 100) {
					clearInterval(progressInterval);

					const reader = new FileReader();
					reader.onloadend = () => {
						const base64File = reader.result as string;
						localStorage.setItem(filename, base64File);

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
			const base64Image = localStorage.getItem(filename);

			if (base64Image) {
				try {
					const byteCharacters = atob(base64Image.split(",")[1]);
					const byteArrays = new Uint8Array(byteCharacters.length);

					for (let i = 0; i < byteCharacters.length; i++) {
						byteArrays[i] = byteCharacters.charCodeAt(i);
					}

					const blob = new Blob([byteArrays], { type: "image/png" });
					observer.next(blob);
					observer.complete();
				} catch (error) {
					observer.error("Error decoding image from localStorage");
				}
			} else {
				observer.error("Image not found in localStorage");
			}
		});
	}
}
