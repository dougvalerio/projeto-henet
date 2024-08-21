import { Component, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { FotosService } from '../../services/fotos.service';  // Importando o serviço
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Imagem } from '../../models/imagem';
import { forkJoin, map } from 'rxjs';

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
  selectedQrcodeSrc: SafeUrl | null = null;  // Adicionando variável para o QR code
  imagens: SafeUrl[] = [];  // Array para armazenar URLs seguras das imagens
  fotoAtualId: number | null = null;  // Armazena o ID da foto atual

  constructor(private fotosService: FotosService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.carregarImagens();
  }

  carregarImagens(): void {
    this.fotosService.getAllImagens().subscribe((fotos: Imagem[]) => {
      console.log("Exibir fotos", fotos);
      
      // Ordenar as fotos por ID em ordem decrescente
      fotos.sort((a, b) => b.id - a.id);
  
      // Limpa o array para evitar duplicação se o método for chamado novamente
      this.imagens = [];
  
      // Criar um array de observables para carregar todas as imagens
      const observables = fotos.map(foto =>
        this.fotosService.getImagem(foto.id).pipe(
          map((imagemBlob: Blob) => {
            const objectURL = URL.createObjectURL(imagemBlob);
            return this.sanitizer.bypassSecurityTrustUrl(objectURL);
          })
        )
      );
  
      // Esperar que todos os observables sejam concluídos antes de preencher o array de imagens
      forkJoin(observables).subscribe((sanitizedUrls: SafeUrl[]) => {
        this.imagens = sanitizedUrls;
      });
    });
  }

  openImagePopup(imageSrc: SafeUrl, fotoId: number): void {
    this.selectedImageSrc = imageSrc;
    this.fotoAtualId = fotoId;  // Armazena o ID da foto atual
    this.isPopupOpen = true;

    // Exibe no console o ID da foto ao abrir o popup
    console.log('ID da Foto:', fotoId);

    // Carregar o QR code baseado no ID da foto
    this.fotosService.getQrcodeById(fotoId).subscribe((qrcodeBlob: Blob) => {
      const objectURL = URL.createObjectURL(qrcodeBlob);
      this.selectedQrcodeSrc = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      
      // Exibe no console o ID do QR code após carregá-lo
      console.log('ID do QR Code:', fotoId);
    });
  }

  closeImagePopup(): void {
    this.isPopupOpen = false;
    this.selectedImageSrc = null;
    this.selectedQrcodeSrc = null;  // Limpar a URL do QR code
    this.fotoAtualId = null;  // Limpar o ID da foto atual
  }
}
