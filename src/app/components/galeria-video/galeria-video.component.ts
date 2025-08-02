import { Component, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { VideosService } from '../../services/videos.service';
import { ConfigService } from '../../services/config.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Video } from '../../models/video';
import { map } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-galeria-video',
  standalone: true,
  imports: [MatGridListModule, CommonModule],
  templateUrl: './galeria-video.component.html',
  styleUrls: ['./galeria-video.component.css']
})
export class GaleriaVideoComponent implements OnInit {
  isPopupOpen = false;
  isDeleteConfirmationOpen = false;
  selectedVideoSrc: SafeUrl | null = null;
  selectedQrcodeSrc: SafeUrl | null = null;
  companyQrcodeSrc: SafeUrl | null = null;
  showCompanyQrcode = false;
  videos: SafeUrl[] = [];
  videosIds: number[] = [];
  videoAtualId: number | null = null;
  private qrcodeTimeout: any;

  constructor(
    private videosService: VideosService,
    private configService: ConfigService,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.carregarVideos();
  }

  carregarVideos(): void {
    this.videosService.getAllVideos().subscribe({
      next: (videos: Video[]) => {
        videos.sort((a, b) => b.id - a.id);
        this.videos = [];
        this.videosIds = [];
        videos.forEach((video, index) => {
          setTimeout(() => {
            this.videosService.getVideo(video.id).pipe(
              map((videoBlob: Blob) => {
                const objectURL = URL.createObjectURL(videoBlob);
                this.videos.push(this.sanitizer.bypassSecurityTrustUrl(objectURL));
                this.videosIds.push(video.id);
              })
            ).subscribe({
              error: (err) => {
                console.error(`Erro ao carregar vídeo com ID ${video.id}:`, err);
                this.snackBar.open('Erro ao carregar vídeo!', 'Fechar', { duration: 5000 });
              }
            });
          }, index * 100);
        });
      },
      error: (err) => {
        console.error('Erro ao carregar lista de vídeos:', err);
        this.snackBar.open('Erro ao carregar vídeos!', 'Fechar', { duration: 5000 });
      }
    });
  }

  openVideoPopup(videoSrc: SafeUrl, videoId: number): void {
    this.selectedVideoSrc = videoSrc;
    this.videoAtualId = videoId;
    this.isPopupOpen = true;
    console.log('ID do Vídeo:', videoId);

    this.videosService.getQrcodeById(videoId).subscribe({
      next: (qrcodeBlob: Blob) => {
        const objectURL = URL.createObjectURL(qrcodeBlob);
        this.selectedQrcodeSrc = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        console.log('ID do QR Code:', videoId);
      },
      error: (err) => {
        console.error(`Erro ao carregar QR code do vídeo com ID ${videoId}:`, err);
        this.snackBar.open('Erro ao carregar QR code!', 'Fechar', { duration: 5000 });
        this.selectedQrcodeSrc = null;
      }
    });

    this.configService.getQrCode().subscribe((companyQrcodeBlob: Blob) => {
      const objectURL = URL.createObjectURL(companyQrcodeBlob);
      this.companyQrcodeSrc = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      this.showCompanyQrcode = true;

      this.qrcodeTimeout = setTimeout(() => {
        this.showCompanyQrcode = false;
      }, 5000);
    }, (err) => {
      console.error('Erro ao carregar QR code da empresa:', err);
      this.snackBar.open('Erro ao carregar QR code da empresa!', 'Fechar', { duration: 5000 });
    });
  }

  closeVideoPopup(): void {
    this.isPopupOpen = false;
    this.isDeleteConfirmationOpen = false;
    this.selectedVideoSrc = null;
    this.selectedQrcodeSrc = null;
    this.companyQrcodeSrc = null;
    this.showCompanyQrcode = false;
    this.videoAtualId = null;
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
    if (this.videoAtualId !== null) {
      this.videosService.delete(this.videoAtualId).subscribe({
        next: () => {
          this.snackBar.open('Vídeo excluído com sucesso!', 'Fechar', { duration: 5000 });
          this.closeDeleteConfirmationPopup();
          this.closeVideoPopup();
          this.carregarVideos();
        },
        error: (err) => {
          console.error('Erro ao excluir vídeo:', err);
          this.snackBar.open('Erro ao excluir o vídeo!', 'Fechar', { duration: 5000 });
          this.closeDeleteConfirmationPopup();
        }
      });
    }
  }
}