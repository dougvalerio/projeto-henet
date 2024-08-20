import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FotosService } from '../../services/fotos.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {
  constructor(
    private fotosService: FotosService,
    private snackBar: MatSnackBar
  ) {}

  carregarFoto(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      this.fotosService.uploadFoto(formData).subscribe({
        next: (response) => {
          console.log('Upload realizado com sucesso', response);
          this.snackBar.open('Imagem carregada com sucesso!', 'Fechar', {
            duration: 3000,
          });
        },
        error: (error) => {
          console.error('Erro no upload', error);
        }
      });
    }
  }
}
