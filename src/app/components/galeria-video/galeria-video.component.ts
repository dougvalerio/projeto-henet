import { Component, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { VideosService } from '../../services/videos.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Video } from '../../models/video';
import { forkJoin, map } from 'rxjs';
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
  selectedVideoSrc: SafeUrl | null = null;
  selectedQrcodeSrc: SafeUrl | null = null;
  videos: SafeUrl[] = [];
  videosIds: number[] = [];
  videoAtualId: number | null = null;

  constructor(private videosService: VideosService, private sanitizer: DomSanitizer, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.carregarVideos();
  }

  carregarVideos(): void {
    this.videosService.getAllVideos().subscribe((videos: Video[]) => {
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
          ).subscribe();
        }, index * 100);
      });
    });
  }

  openVideoPopup(videoSrc: SafeUrl, videoId: number): void {
    this.selectedVideoSrc = videoSrc;
    this.videoAtualId = videoId;
    this.isPopupOpen = true;

    console.log('ID do Vídeo:', videoId);

    this.videosService.getQrcodeById(videoId).subscribe((qrcodeBlob: Blob) => {
      const objectURL = URL.createObjectURL(qrcodeBlob);
      this.selectedQrcodeSrc = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      
      console.log('ID do QR Code:', videoId);
    });
  }

  closeVideoPopup(): void {
    this.isPopupOpen = false;
    this.selectedVideoSrc = null;
    this.selectedQrcodeSrc = null;
    this.videoAtualId = null;
  }

  deleteVideoPopup(): void {
    if (this.videoAtualId) {
      this.videosService.delete(this.videoAtualId).subscribe(() => {
        this.snackBar.open('Vídeo excluído com sucesso!', 'Fechar', {
          duration: 5000,
        });     
        this.closeVideoPopup();
        this.carregarVideos();
      }, ex => {
        this.snackBar.open('Erro ao excluir o vídeo!', 'Fechar', {
          duration: 5000,
        });    
      });
    }
  }
}