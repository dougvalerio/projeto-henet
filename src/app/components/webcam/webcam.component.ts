import { Component, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VideosService } from '../../services/videos.service';

@Component({
  selector: 'app-webcam-dialog',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.css']
})
export class WebcamComponent {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  mediaRecorder: MediaRecorder | null = null;
  recordedChunks: Blob[] = [];
  stream: MediaStream | null = null;

  constructor(
    public dialogRef: MatDialogRef<WebcamComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private videosService: VideosService,
    private snackBar: MatSnackBar
  ) {
    this.startWebcam();
  }

  async startWebcam(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      if (this.videoElement && this.videoElement.nativeElement) {
        this.videoElement.nativeElement.srcObject = this.stream;
        this.videoElement.nativeElement.play().catch(error => {
          console.error('Erro ao reproduzir o vídeo:', error);
          this.snackBar.open('Erro ao exibir a webcam.', 'Fechar', { duration: 3000 });
        });
      }
      this.recordedChunks = [];
      this.mediaRecorder = new MediaRecorder(this.stream);
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };
      this.mediaRecorder.start();
    } catch (error) {
      console.error('Erro ao acessar a câmera:', error);
      this.snackBar.open('Erro ao acessar a câmera. Verifique as permissões.', 'Fechar', { duration: 3000 });
      this.dialogRef.close();
    }
  }

  stopRecording(): void {
    if (this.mediaRecorder && this.stream) {
      this.mediaRecorder.stop();
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        const formData = new FormData();
        formData.append('file', blob, 'recorded-video.webm');

        this.videosService.uploadVideo(formData).subscribe({
          next: (response) => {
            console.log('Vídeo gravado enviado com sucesso', response);
            this.snackBar.open('Vídeo carregado com sucesso!', 'Fechar', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Erro ao enviar vídeo', error);
            this.snackBar.open('Erro ao carregar o vídeo.', 'Fechar', { duration: 3000 });
            this.dialogRef.close();
          }
        });

        this.stopCamera();
      };
    }
  }

  cancel(): void {
    this.stopCamera();
    this.dialogRef.close();
  }

  private stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }
}