import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Output,
} from "@angular/core";
import { BehaviorSubject, finalize, map, Observable, Subscription, tap } from "rxjs";
import { UploadService } from "src/app/services/upload.service";

@Component({
	selector: "app-img-loadable",
	templateUrl: "./img-loadable.component.html",
	styleUrls: ["./img-loadable.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImgLoadableComponent implements OnInit {
	@Input() fit: string;
	@Input() width: string;
	@Input() height: string;
	@Input() zoomInDialog: boolean;
	@Output() dismiss = new EventEmitter<boolean>();

	@Input() set src(value: string | string[]) {
		if (value) {
			this.imageLoadingInternal$.next(true);
			const srcValue = Array.isArray(value) ? value[0] : value;
			this.subscription = this.fileService
				.getImage(srcValue)
				.pipe(
					map((blob) => URL.createObjectURL(blob)),
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
