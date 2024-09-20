import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { HomeComponent } from './components/home/home.component';
import { GaleriaComponent } from './components/galeria/galeria.component';
import { QrcodeComponent } from './components/qrcode/qrcode.component';
import { UploadComponent } from './components/upload/upload.component';
import { ConfigComponent } from './components/config/config.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { ConfigService } from './services/config.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, HomeComponent, GaleriaComponent, QrcodeComponent, UploadComponent, ConfigComponent, FeedbackComponent, ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'projeto-henet';

  constructor(private configService: ConfigService) {} // Injetando o ConfigService

  ngOnInit(): void {
    this.loadSavedLogo();
    this.loadSavedBackground();
    this.loadSavedQrCode();
  }

  loadSavedLogo() {
    this.configService.getLogo().subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        this.setLogo(url);
      },
      error: (error) => {
        console.error('Erro ao carregar a logo:', error);
      }
    });
  }

  setLogo(imageUrl: string) {
    const logoElement = document.querySelector('.logo') as HTMLImageElement;
    if (logoElement) {
      logoElement.src = imageUrl;
    }
  }

  loadSavedBackground() {
    this.configService.getBackground().subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        this.setBackground(url);
      },
      error: (error) => {
        console.error('Erro ao carregar o background:', error);
      }
    });
  }

  setBackground(imageUrl: string) {
    const backgroundContainer = document.querySelector('.background-container') as HTMLElement;
    if (backgroundContainer) {
      backgroundContainer.style.backgroundImage = `url(${imageUrl})`;
      backgroundContainer.style.backgroundSize = 'cover';
      backgroundContainer.style.backgroundRepeat = 'no-repeat';
      backgroundContainer.style.backgroundPosition = 'center';
    }
  }

  loadSavedQrCode() {
    this.configService.getQrCode().subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        this.setQrCode(url);
      },
      error: (error) => {
        console.error('Erro ao carregar o QR Code:', error);
      }
    });
  }

  setQrCode(imageUrl: string) {
    const qrCodeContainer = document.querySelector('.div-qrcode');
    const existingQrCode = qrCodeContainer?.querySelector('.qrcode') as HTMLImageElement;

    if (existingQrCode) {
      qrCodeContainer?.removeChild(existingQrCode);
    }

    const newQrCodeElement = document.createElement('img');
    newQrCodeElement.src = imageUrl;
    newQrCodeElement.classList.add('qrcode');
    newQrCodeElement.alt = 'qrcode';

    if (qrCodeContainer) {
      qrCodeContainer.appendChild(newQrCodeElement);
    }
  }
}
