import { Component, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FotosService } from '../../services/fotos.service';
import { VideosService } from '../../services/videos.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  mediaRecorder: MediaRecorder | null = null;
  recordedChunks: Blob[] = [];
  isRecording: boolean = false;

  constructor(
    private fotosService: FotosService,
    private videosService: VideosService,
    private snackBar: MatSnackBar
  ) {}

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

  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      if (this.videoElement) {
        this.videoElement.nativeElement.srcObject = stream;
      }
      this.recordedChunks = [];
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };
      this.mediaRecorder.start();
      this.isRecording = true;
    } catch (error) {
      console.error('Erro ao acessar a câmera:', error);
      this.snackBar.open('Erro ao acessar a câmera.', 'Fechar', {
        duration: 3000,
      });
    }
  }

  stopRecording(): void {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        const formData = new FormData();
        formData.append('file', blob, 'recorded-video.webm');

        this.videosService.uploadVideo(formData).subscribe({
          next: (response) => {
            console.log('Vídeo gravado enviado com sucesso', response);
            this.snackBar.open('Vídeo carregado com sucesso!', 'Fechar', {
              duration: 3000,
            });
          },
          error: (error) => {
            console.error('Erro ao enviar vídeo', error);
            this.snackBar.open('Erro ao carregar o vídeo.', 'Fechar', {
              duration: 3000,
            });
          }
        });

        // Limpar o stream da câmera
        const stream = this.videoElement?.nativeElement.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
        this.isRecording = false;
      };
    }
  }
}