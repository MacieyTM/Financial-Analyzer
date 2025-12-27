import { APP_INITIALIZER, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { AppTranslateService } from "./services/translate.service";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { MatDialogModule } from "@angular/material/dialog";
import { IonicStorageModule } from "@ionic/storage-angular";
import { UiModule } from "./ui.module";

export function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

const initializeApp = () => {
	return () => {};
};

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		IonicModule.forRoot(),
		AppRoutingModule,
		BrowserAnimationsModule,
		MatFormFieldModule,
		MatSelectModule,
		MatIconModule,
		MatDividerModule,
		MatDialogModule,
		UiModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: createTranslateLoader,
				deps: [HttpClient],
			},
		}),
		IonicStorageModule.forRoot(),
	],
	providers: [
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
		{
			provide: APP_INITIALIZER,
			useFactory: initializeApp,
			deps: [AppTranslateService],
			multi: true,
		},
		provideHttpClient(withInterceptorsFromDi()),
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
