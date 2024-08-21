import { Component, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { FotosService } from '../../services/fotos.service';  // Importando o serviço
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Imagem } from '../../models/imagem';

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [MatGridListModule, CommonModule],
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.css']
})
export class GaleriaComponent implements OnInit {
  isPopupOpen = false;
  selectedImageSrc: SafeUrl | null = null;
  imagens: SafeUrl[] = [];  // Array para armazenar URLs seguras das imagens

  constructor(private fotosService: FotosService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.carregarImagens();
  }

  carregarImagens(): void {
    this.fotosService.getAllFotos().subscribe((fotos: Imagem[]) => {
      fotos.forEach(foto => {
        this.fotosService.getFoto(foto.id).subscribe((imagemBlob: Blob) => {
          const objectURL = URL.createObjectURL(imagemBlob);
          const sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          this.imagens.push(sanitizedUrl);
        });
      });
    });
  }

  openImagePopup(imageSrc: SafeUrl): void {
    this.selectedImageSrc = imageSrc;
    this.isPopupOpen = true;
  }

  closeImagePopup(): void {
    this.isPopupOpen = false;
    this.selectedImageSrc = null;
  }
}
