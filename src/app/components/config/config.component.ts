import { Component } from '@angular/core';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [],
  templateUrl: './config.component.html',
  styleUrl: './config.component.css'
})
export class ConfigComponent {
  logoPreview: string | ArrayBuffer | null = null;
  backgroundPreview: string | ArrayBuffer | null = null;
  molduraPreview: string | ArrayBuffer | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  onFileSelected(event: any, type: string) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // Definir o preview da imagem de acordo com o tipo
        if (type === 'logo') {
          this.logoPreview = reader.result;
        } else if (type === 'background') {
          this.backgroundPreview = reader.result;
        } else if (type === 'moldura') {
          this.molduraPreview = reader.result;
        } else if (type === 'image') {
          this.imagePreview = reader.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }
}
