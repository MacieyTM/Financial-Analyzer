import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { HomePage } from "./home.page";
import { HomePageRoutingModule } from "./home-routing.module";
import { UiModule } from "../ui.module";
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from "ng2-charts";
import { TakePhotoComponent } from "./take-photo/take-photo.component";
import { ImgLoadableComponent } from "./img-loadable/img-loadable.component";

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		HomePageRoutingModule,
		UiModule,
		BaseChartDirective,
	],
	declarations: [HomePage, TakePhotoComponent, ImgLoadableComponent],
	providers: [provideCharts(withDefaultRegisterables())],
})
export class HomePageModule {}
