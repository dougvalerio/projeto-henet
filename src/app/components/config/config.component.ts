import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [],
  templateUrl: './config.component.html',
  styleUrl: './config.component.css'
})
export class ConfigComponent implements OnInit {
  logoPreview: string | ArrayBuffer | null = null;
  backgroundPreview: string | ArrayBuffer | null = null;
  molduraPreview: string | ArrayBuffer | null = null;
  qrcodePreview: string | ArrayBuffer | null = null;

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    this.loadSavedLogo();
    this.loadSavedBackground();
    this.loadSavedQrCode();
  }

  onFileSelected(event: any, type: string) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (type === 'logo') {
          this.uploadLogo(file);
          this.logoPreview = reader.result;
        } else if (type === 'background') {
          this.uploadBackground(file);
          this.backgroundPreview = reader.result;
        } else if (type === 'moldura') {
          this.uploadMoldura(file);
          this.molduraPreview = reader.result;
        } else if (type === 'qrcode') {
          this.uploadQrCode(file);  
          this.qrcodePreview = reader.result;
          console.log('Preview do QR Code atualizado:', this.qrcodePreview); // Log para ver se está carregando corretamente
        }
      };
      reader.readAsDataURL(file);
    }
  }

  /* LOGO */

  uploadLogo(file: File) {
    this.configService.uploadLogo(file).subscribe({
      next: (response) => {
        console.log('Logo uploaded successfully. URL:', response);
        // Atualiza a logo no BehaviorSubject, o que será refletido no componente Header
        this.configService.changeLogo(response);
      },
      error: (error) => {
        console.error('Error uploading logo:', error);
      }
    });
  }

  loadSavedLogo() {
    this.configService.getLogo().subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        console.log("Logo carregada:", url);
        this.configService.changeLogo(url); // Atualiza logo salva ao iniciar
      },
      error: (error) => {
        console.error('Error loading logo:', error);
      }
    });
  }

  setLogo(imageUrl: string) {
    const logoElement = document.querySelector('.logo') as HTMLElement;
    if (logoElement) {
      logoElement.style.backgroundImage = `url(${imageUrl})`;
      logoElement.style.backgroundSize = 'contain';
      logoElement.style.backgroundRepeat = 'no-repeat';
    }
  }

  /* BACKGROUND */

  uploadBackground(file: File) {
    this.configService.uploadBackground(file).subscribe({
      next: (response) => {
        console.log('Background uploaded successfully:', response);
        this.setBackground(response); // Define o background com a URL retornada
      },
      error: (error) => {
        console.error('Error uploading background:', error);
      }
    });
  }

  loadSavedBackground() {
    this.configService.getBackground().subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        this.setBackground(url); // Carrega o background previamente salvo
      },
      error: (error) => {
        console.error('Error loading background:', error);
      }
    });
  }

  setBackground(imageUrl: string) {
    const backgroundContainer = document.querySelector('.background-container') as HTMLElement;
    if (backgroundContainer) {
      backgroundContainer.style.background = `url(${imageUrl}) no-repeat center center`;
      backgroundContainer.style.backgroundSize = 'cover';
    }
  }

  /* MOLDURA */

  uploadMoldura(file: File) {
    this.configService.uploadMoldura(file).subscribe({
      next: (response) => {
        console.log('Moldura uploaded successfully:', response);
      },
      error: (error) => {
        console.error('Error uploading moldura:', error);
      }
    });
  }

  /* QR CODE */

  uploadQrCode(file: File) {
    this.configService.uploadQrCode(file).subscribe({
      next: (response) => {
        console.log('QR Code URL recebido:', response); // Certifique-se de que esta URL é correta
        this.configService.changeQrCode(response);  // Atualiza o QR Code com a URL retornada
      },
      error: (error) => {
        console.error('Erro ao enviar QR Code:', error);
      }
    });
  }
  
  loadSavedQrCode() {
    this.configService.getQrCode().subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        console.log("QrCode carregado:", url);
        this.configService.changeQrCode(url); // Atualiza QR Code salvo ao iniciar
      },
      error: (error) => {
        console.error('Error loading QR Code:', error);
      }
    });
  }

  setQrCode(imageUrl: string) {
    const qrCodeElement = document.querySelector('.qrcode') as HTMLElement;
    if (qrCodeElement) {
      qrCodeElement.style.backgroundImage = `url(${imageUrl})`;
      qrCodeElement.style.backgroundSize = 'contain';
      qrCodeElement.style.backgroundRepeat = 'no-repeat';
    }
  }
}