import { Component, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { FotosService } from '../../services/fotos.service';
import { ConfigService } from '../../services/config.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Imagem } from '../../models/imagem';
import { forkJoin, map } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [MatGridListModule, CommonModule],
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.css']
})
export class GaleriaComponent implements OnInit {
  isPopupOpen = false;
  isDeleteConfirmationOpen = false;
  selectedImageSrc: SafeUrl | null = null;
  selectedQrcodeSrc: SafeUrl | null = null;
  companyQrcodeSrc: SafeUrl | null = null;
  showCompanyQrcode = false;
  imagens: SafeUrl[] = [];
  imagensIds: number[] = [];
  fotoAtualId: number | null = null;
  private qrcodeTimeout: any;

  constructor(
    private fotosService: FotosService,
    private configService: ConfigService,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.carregarImagens();
  }

  carregarImagens(): void {
    this.fotosService.getAllImagens().subscribe((fotos: Imagem[]) => {
      fotos.sort((a, b) => b.id - a.id);
      this.imagens = [];
      this.imagensIds = [];
      fotos.forEach((foto, index) => {
        setTimeout(() => {
          this.fotosService.getImagem(foto.id).pipe(
            map((imagemBlob: Blob) => {
              const objectURL = URL.createObjectURL(imagemBlob);
              this.imagens.push(this.sanitizer.bypassSecurityTrustUrl(objectURL));
              this.imagensIds.push(foto.id);
            })
          ).subscribe();
        }, index * 100);
      });
    });
  }

  openImagePopup(imageSrc: SafeUrl, fotoId: number): void {
    this.selectedImageSrc = imageSrc;
    this.fotoAtualId = fotoId;
    this.isPopupOpen = true;
    console.log('ID da Foto:', fotoId);

    this.fotosService.getQrcodeById(fotoId).subscribe((qrcodeBlob: Blob) => {
      const objectURL = URL.createObjectURL(qrcodeBlob);
      this.selectedQrcodeSrc = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      console.log('ID do QR Code:', fotoId);
    });

    this.configService.getQrCode().subscribe((companyQrcodeBlob: Blob) => {
      const objectURL = URL.createObjectURL(companyQrcodeBlob);
      this.companyQrcodeSrc = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      this.showCompanyQrcode = true;

      this.qrcodeTimeout = setTimeout(() => {
        this.showCompanyQrcode = false;
      }, 5000);
    });
  }

  closeImagePopup(): void {
    this.isPopupOpen = false;
    this.selectedImageSrc = null;
    this.selectedQrcodeSrc = null;
    this.companyQrcodeSrc = null;
    this.showCompanyQrcode = false;
    this.fotoAtualId = null;
    if (this.qrcodeTimeout) {
      clearTimeout(this.qrcodeTimeout);
    }
  }

  openDeleteConfirmationPopup(): void {
    this.isDeleteConfirmationOpen = true;
  }

  closeDeleteConfirmationPopup(): void {
    this.isDeleteConfirmationOpen = false;
  }

  confirmDelete(): void {
    if (this.fotoAtualId !== null) {
      this.fotosService.delete(this.fotoAtualId).subscribe(() => {
        this.snackBar.open('Imagem excluída com sucesso!', 'Fechar', {
          duration: 5000,
        });
        this.closeDeleteConfirmationPopup();
        this.closeImagePopup();
        this.carregarImagens();
      }, ex => {
        this.snackBar.open('Erro ao excluir a imagem!', 'Fechar', {
          duration: 5000,
        });
        this.closeDeleteConfirmationPopup();
      });
    }
  }
}