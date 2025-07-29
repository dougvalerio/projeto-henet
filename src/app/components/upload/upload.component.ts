import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { FotosService } from '../../services/fotos.service';
import { VideosService } from '../../services/videos.service';
import { WebcamComponent } from '../webcam/webcam.component';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent implements OnInit {
  isMobile: boolean = false;

  constructor(
    private fotosService: FotosService,
    private videosService: VideosService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  carregarFoto(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      this.fotosService.uploadFoto(formData).subscribe({
        next: (response) => {
          console.log('Foto carregada com sucesso', response);
          this.snackBar.open('Foto carregada com sucesso!', 'Fechar', {
            duration: 3000,
          });
        },
        error: (error) => {
          console.error('Erro no upload da foto', error);
          this.snackBar.open('Erro ao carregar a foto.', 'Fechar', {
            duration: 3000,
          });
        }
      });
    }
  }

  carregarVideo(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      this.videosService.uploadVideo(formData).subscribe({
        next: (response) => {
          console.log('Vídeo carregado com sucesso', response);
          this.snackBar.open('Vídeo carregado com sucesso!', 'Fechar', {
            duration: 3000,
          });
        },
        error: (error) => {
          console.error('Erro no upload do vídeo', error);
          this.snackBar.open('Erro ao carregar o vídeo.', 'Fechar', {
            duration: 3000,
          });
        }
      });
    }
  }

  startRecording(): void {
    if (this.isMobile) {
      // No celular, dispara o input de vídeo para abrir a câmera nativa
      const videoInput = document.getElementById('videoInput') as HTMLInputElement;
      videoInput.click();
    } else {
      // No desktop, abre um popup com a webcam
      this.dialog.open(WebcamComponent, {
        width: '700px',
        disableClose: true
      });
    }
  }
}