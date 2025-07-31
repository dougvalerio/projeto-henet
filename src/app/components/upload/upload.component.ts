import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { FotosService } from '../../services/fotos.service';
import { VideosService } from '../../services/videos.service';
import { CameraComponent } from '../camera/camera.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent implements OnInit {
  isMobile: boolean = false;
  isUploading: boolean = false;
  uploadMessage: string = '';

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
      this.isUploading = true;
      this.uploadMessage = 'ENVIANDO FOTO';
      const formData = new FormData();
      formData.append('file', file);

      this.fotosService.uploadFoto(formData).subscribe({
        next: (response) => {
          console.log('Foto carregada com sucesso', response);
          this.snackBar.open('Foto carregada com sucesso!', 'Fechar', {
            duration: 3000,
          });
          this.isUploading = false;
        },
        error: (error) => {
          console.error('Erro no upload da foto', error);
          this.snackBar.open('Erro ao carregar a foto.', 'Fechar', {
            duration: 3000,
          });
          this.isUploading = false;
        }
      });
    }
  }

  carregarVideo(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.isUploading = true;
      this.uploadMessage = 'ENVIANDO VÍDEO';
      const formData = new FormData();
      formData.append('file', file);

      this.videosService.uploadVideo(formData).subscribe({
        next: (response) => {
          console.log('Vídeo carregado com sucesso', response);
          this.snackBar.open('Vídeo carregado com sucesso!', 'Fechar', {
            duration: 3000,
          });
          this.isUploading = false;
        },
        error: (error) => {
          console.error('Erro no upload do vídeo', error);
          this.snackBar.open('Erro ao carregar o vídeo.', 'Fechar', {
            duration: 3000,
          });
          this.isUploading = false;
        }
      });
    }
  }

  openCameraDialog(): void {
    const dialogRef = this.dialog.open(CameraComponent, {
      width: this.isMobile ? '90%' : '700px',
      disableClose: true,
      data: { isMobile: this.isMobile }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isUploading = true;
        this.uploadMessage = result.type === 'photo' ? 'ENVIANDO FOTO' : 'ENVIANDO VÍDEO';
        const formData = new FormData();
        formData.append('file', result.file);

        if (result.type === 'photo') {
          this.fotosService.uploadFoto(formData).subscribe({
            next: (response) => {
              console.log('Foto capturada carregada com sucesso', response);
              this.snackBar.open('Foto capturada com sucesso!', 'Fechar', {
                duration: 3000,
              });
              this.isUploading = false;
            },
            error: (error) => {
              console.error('Erro no upload da foto capturada', error);
              this.snackBar.open('Erro ao carregar a foto capturada.', 'Fechar', {
                duration: 3000,
              });
              this.isUploading = false;
            }
          });
        } else if (result.type === 'video') {
          this.videosService.uploadVideo(formData).subscribe({
            next: (response) => {
              console.log('Vídeo capturado carregado com sucesso', response);
              this.snackBar.open('Vídeo capturado com sucesso!', 'Fechar', {
                duration: 3000,
              });
              this.isUploading = false;
            },
            error: (error) => {
              console.error('Erro no upload do vídeo capturado', error);
              this.snackBar.open('Erro ao carregar o vídeo capturado.', 'Fechar', {
                duration: 3000,
              });
              this.isUploading = false;
            }
          });
        }
      }
    });
  }
}