import { Component } from '@angular/core';
import { FotosService } from '../../services/fotos.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {
  constructor(private fotosService: FotosService) {}

  carregarFoto(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      this.fotosService.uploadFoto(formData).subscribe({
        next: (response) => {
          console.log('Upload realizado com sucesso', response);
          // Adicione aqui qualquer lógica adicional que você precise após o upload
        },
        error: (error) => {
          console.error('Erro no upload', error);
        }
      });
    }
  }
}
