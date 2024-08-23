import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { SliderComponent } from './components/slider/slider.component';
import { GaleriaComponent } from './components/galeria/galeria.component';
import { QrcodeComponent } from './components/qrcode/qrcode.component';
import { UploadComponent } from './components/upload/upload.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SliderComponent, GaleriaComponent, QrcodeComponent, UploadComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'projeto-henet';
}
