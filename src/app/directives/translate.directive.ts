import {
	ChangeDetectorRef,
	Directive,
	ElementRef,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	Renderer2,
	SimpleChanges,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { EMPTY, Observable, Subscription, first, switchMap, tap } from "rxjs";

@Directive({
	selector: "[appTranslate]",
})
export class TranslateDirective implements OnInit, OnChanges, OnDestroy {
	@Input({ required: true })
	appTranslate: string;
	@Input() appTranslateParams: object;

	private readonly subscription: Subscription;

	public constructor(
		private readonly translate: TranslateService,
		private readonly renderer: Renderer2,
		private readonly el: ElementRef,
		private readonly cdRef: ChangeDetectorRef
	) {
		this.subscription = this.translate.onLangChange
			.pipe(switchMap(() => this.performTranslation()))
			.subscribe();
	}

	public ngOnInit(): void {
		this.performTranslation().subscribe();
	}

	public ngOnChanges(_: SimpleChanges): void {
		this.performTranslation().subscribe();
	}

	public ngOnDestroy(): void {
		this.subscription?.unsubscribe();
	}

	private performTranslation(): Observable<void> {
		if (!this.appTranslate) {
			return EMPTY;
		}

		return this.translate.get(this.appTranslate, this.appTranslateParams).pipe(
			tap((translatedText) => {
				this.renderer.setProperty(this.el.nativeElement, "innerText", translatedText);
				this.cdRef.detectChanges();
			}),
			first()
		);
	}
}
