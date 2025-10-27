import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Output,
} from "@angular/core";
import { BehaviorSubject, finalize, from, Observable, Subscription, switchMap, tap } from "rxjs";
import { UploadService } from "src/app/services/upload.service";

@Component({
	selector: "app-img-loadable",
	templateUrl: "./img-loadable.component.html",
	styleUrls: ["./img-loadable.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImgLoadableComponent implements OnInit, OnDestroy {
	@Input() fit: string;
	@Input() width: string;
	@Input() height: string;
	@Input() zoomInDialog: boolean;
	@Output() dismiss = new EventEmitter<boolean>();

	@Input() set src(value: string | string[]) {
		if (value) {
			this.imageLoadingInternal$.next(true);
			const srcValue = Array.isArray(value) ? value[0] : value;

			// When the src is a path saved via Capacitor Filesystem, we need to read it back
			this.subscription = from(this.fileService.getFile(srcValue))
				.pipe(
					switchMap(async (fileData) => {
						// If the fileData is base64 (as stored in Filesystem)
						if (typeof fileData === "string" && fileData.startsWith("data:")) {
							// Base64 → Blob → Object URL for <img> or <ion-img>
							const response = await fetch(fileData);
							const blob = await response.blob();
							return URL.createObjectURL(blob);
						}
						// Otherwise, assume it's a blob URL already
						return URL.createObjectURL(fileData as any);
					}),
					tap((url) => this.imageBlobUrlInternal$.next(url)),
					finalize(() => this.imageLoadingInternal$.next(false))
				)
				.subscribe();
		} else {
			this.imageBlobUrlInternal$.next(null);
			this.imageLoadingInternal$.next(false);
		}
	}

	private readonly imageLoadingInternal$ = new BehaviorSubject<boolean>(false);
	private readonly imageBlobUrlInternal$ = new BehaviorSubject<string>("");
	private subscription: Subscription;

	public imageLoading$: Observable<boolean>;
	public imageBlobUrl$: Observable<string>;

	constructor(private readonly fileService: UploadService) {}

	ngOnInit() {
		this.imageLoading$ = this.imageLoadingInternal$.asObservable();
		this.imageBlobUrl$ = this.imageBlobUrlInternal$.asObservable();
	}

	ngOnDestroy(): void {
		this.subscription?.unsubscribe();
	}
}
