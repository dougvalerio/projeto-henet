import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { HomeComponent } from './components/home/home.component';
import { GaleriaComponent } from './components/galeria/galeria.component';
import { QrcodeComponent } from './components/qrcode/qrcode.component';
import { UploadComponent } from './components/upload/upload.component';
import { ConfigComponent } from './components/config/config.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, HomeComponent, GaleriaComponent, QrcodeComponent, UploadComponent, ConfigComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'projeto-henet';
}
