import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common'; // Importar CommonModule

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css'],
  standalone: true, // Componente standalone
  imports: [
    CommonModule, // Adicionar CommonModule para *ngIf
    MatDialogModule, // Para MatDialog
    MatSnackBarModule // Para MatSnackBar
  ]
})
export class CameraComponent implements OnInit, OnDestroy {
  videoStream: MediaStream | null = null;
  isRecording: boolean = false;
  mediaRecorder: MediaRecorder | null = null;
  recordedChunks: Blob[] = [];
  canvas: HTMLCanvasElement | null = null;
  video: HTMLVideoElement | null = null;

  constructor(
    public dialogRef: MatDialogRef<CameraComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { isMobile: boolean },
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.startCamera();
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }

  async startCamera(): Promise<void> {
    try {
      this.videoStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: this.data.isMobile ? 'environment' : 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: true
      });

      this.video = document.getElementById('cameraPreview') as HTMLVideoElement;
      this.canvas = document.getElementById('cameraCanvas') as HTMLCanvasElement;
      this.video.srcObject = this.videoStream;
      this.video.play();
    } catch (error) {
      console.error('Erro ao acessar a câmera:', error);
      this.snackBar.open('Erro ao acessar a câmera.', 'Fechar', { duration: 3000 });
      this.dialogRef.close();
    }
  }

  stopCamera(): void {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
      this.videoStream = null;
    }
  }

  capturePhoto(): void {
    if (this.canvas && this.video) {
      this.canvas.width = this.video.videoWidth;
      this.canvas.height = this.video.videoHeight;
      const context = this.canvas.getContext('2d');
      if (context) {
        context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        this.canvas.toBlob(blob => {
          if (blob) {
            const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
            this.dialogRef.close({ file, type: 'photo' });
          }
        }, 'image/jpeg', 0.95);
      }
    }
  }

  startVideoRecording(): void {
    if (this.videoStream) {
      this.recordedChunks = [];
      this.mediaRecorder = new MediaRecorder(this.videoStream, { mimeType: 'video/webm' });
      this.mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        const file = new File([blob], `video_${Date.now()}.webm`, { type: 'video/webm' });
        this.dialogRef.close({ file, type: 'video' });
      };
      this.mediaRecorder.start();
      this.isRecording = true;
    }
  }

  stopVideoRecording(): void {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}