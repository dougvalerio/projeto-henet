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
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    this.loadSavedBackground();
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
        } else if (type === 'image') {
          this.imagePreview = reader.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  /* LOGO */

  uploadLogo(file: File) {
    this.configService.uploadLogo(file).subscribe({
      next: (response) => {
        console.log('Logo uploaded successfully:', response);
        this.setLogo(response); // Define a logo com a URL retornada
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
        this.setLogo(url); // Carrega a logo previamente salva
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
    const body = document.body;
    body.style.background = `url(${imageUrl}) no-repeat center center`;
    body.style.backgroundSize = 'cover';
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
        console.log('QrCode uploaded successfully:', response);
      },
      error: (error) => {
        console.error('Error uploading qrCode:', error);
      }
    });
  }
}