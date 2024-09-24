import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { CommonModule } from '@angular/common';  // Adicione isto

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './config.component.html',
  styleUrl: './config.component.css'
})
export class ConfigComponent implements OnInit {
  logoPreview: string | ArrayBuffer | null = null;
  backgroundPreview: string | ArrayBuffer | null = null;
  molduraPreview: string | ArrayBuffer | null = null;
  qrcodePreview: string | ArrayBuffer | null = null;
  showModal: boolean = false;
  imageToShow: string | ArrayBuffer | null = null;

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

 // Função chamada ao clicar no botão de visualização
 openImagePopup(type: string) {
  if (type === 'logo') {
    this.configService.getLogo().subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        this.imageToShow = url;
        this.showModal = true;
      },
      error: (error) => {
        console.error('Error loading logo:', error);
      }
    });
  } else if (type === 'background') {
    this.configService.getBackground().subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        this.imageToShow = url;
        this.showModal = true;
      },
      error: (error) => {
        console.error('Error loading background:', error);
      }
    });
  } else if (type === 'moldura') {
    this.configService.getMoldura().subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        this.imageToShow = url;
        this.showModal = true;
      },
      error: (error) => {
        console.error('Error loading moldura:', error);
      }
    });
  } else if (type === 'qrcode') {
    this.configService.getQrCode().subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        this.imageToShow = url;
        this.showModal = true;
      },
      error: (error) => {
        console.error('Error loading QR Code:', error);
      }
    });
  }
}

  closeImagePopup() {
    this.showModal = false;
    this.imageToShow = null;
  }

  /* LOGO */

  uploadLogo(file: File) {
    this.configService.uploadLogo(file).subscribe({
      next: (response) => {
        console.log('Logo uploaded successfully. URL:', response);
        this.setLogo(response); // Define a logo com a URL retornada
        this.loadSavedLogo(); // Atualiza a logo
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
        this.setLogo(url); // Carrega o background previamente salvo
        console.log("Logo carregada:", url);
      },
      error: (error) => {
        console.error('Error loading logo:', error);
      }
    });
  }

  setLogo(imageUrl: string) {
    const logoElement = document.querySelector('.logo') as HTMLImageElement;
    if (logoElement) {
      logoElement.src = imageUrl; // Atualiza diretamente o src da logo
    } else {
      // Caso o elemento não exista (se for necessário), podemos criá-lo dinamicamente
      const newLogoElement = document.createElement('img');
      newLogoElement.src = imageUrl;
      newLogoElement.classList.add('logo');
      
      // Aqui assumimos que a logo está dentro de um contêiner com a classe 'div-logo'
      const logoContainer = document.querySelector('.div-logo');
      if (logoContainer) {
        logoContainer.appendChild(newLogoElement);
      }
    }
  }

  /* BACKGROUND */

  uploadBackground(file: File) {
    this.configService.uploadBackground(file).subscribe({
      next: (response) => {
        console.log('Background uploaded successfully:', response);
        this.setBackground(response); // Define o background com a URL retornada
        this.loadSavedBackground();
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
      backgroundContainer.style.backgroundImage = `url(${imageUrl})`; // Substitui o background existente
      backgroundContainer.style.backgroundSize = 'cover';
      backgroundContainer.style.backgroundRepeat = 'no-repeat';
      backgroundContainer.style.backgroundPosition = 'center';
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
        this.setQrCode(response); // Define o QrCode com a URL retornada
        this.loadSavedQrCode(); // Atualiza o QrCode
        console.log('QR Code URL recebido:', response); // Certifique-se de que esta URL é correta
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
        this.setQrCode(url); // Carrega o QrCode previamente salvo
        console.log("QrCode carregado:", url);
      },
      error: (error) => {
        console.error('Error loading QR Code:', error);
      }
    });
  }

  setQrCode(imageUrl: string) {
    const qrCodeContainer = document.querySelector('.div-qrcode');
    const existingQrCode = qrCodeContainer?.querySelector('.qrcode') as HTMLImageElement;
  
    // Remover o QR Code existente, se houver
    if (existingQrCode) {
      qrCodeContainer?.removeChild(existingQrCode);
    }
  
    // Criar novo elemento de imagem para o QR Code
    const newQrCodeElement = document.createElement('img');
    newQrCodeElement.src = imageUrl;
    newQrCodeElement.classList.add('qrcode');
    newQrCodeElement.alt = 'qrcode';
  
    // Adicionar o novo QR Code no contêiner
    if (qrCodeContainer) {
      qrCodeContainer.appendChild(newQrCodeElement);
    }
  }
  
}