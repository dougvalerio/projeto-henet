import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // Necessário importar para usar diretivas como *ngIf, *ngFor
import { ConfigService } from '../../services/config.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-config',
  standalone: true,  // Define o componente como standalone
  imports: [CommonModule],  // Importe módulos que o standalone component precisa
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {
  logoPreview: string | ArrayBuffer | null = null;
  backgroundPreview: string | ArrayBuffer | null = null;
  molduraPreview: string | ArrayBuffer | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private configService: ConfigService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadBackground(); // Carregar o background ao iniciar o componente
  }

  onFileSelected(event: any, type: string) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (type === 'logo') {
          this.logoPreview = reader.result;
        } else if (type === 'background') {
          this.backgroundPreview = reader.result;
          this.uploadBackground(file); // Chamar o método de upload ao selecionar o arquivo
        } else if (type === 'moldura') {
          this.molduraPreview = reader.result;
        } else if (type === 'image') {
          this.imagePreview = reader.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  // Método para carregar o background ao abrir o app
  loadBackground(): void {
    this.configService.getBackground().subscribe(
      response => {
        const backgroundUrl = URL.createObjectURL(response);
        this.updateGlobalBackground(backgroundUrl); // Atualizar o background no style.css
        this.toastr.success('Background carregado com sucesso!'); // Exibir notificação de sucesso
      },
      error => {
        console.error('Erro ao carregar o background:', error);
        this.toastr.error('Erro ao carregar o background.'); // Exibir notificação de erro
      }
    );
  }

  // Método para upload do background
  uploadBackground(file: File): void {
    this.configService.uploadBackground(file).subscribe(
      response => {
        console.log('Background atualizado com sucesso:', response);
        this.updateGlobalBackground(response); // Atualizar o background no style.css
        this.toastr.success('Background atualizado com sucesso!'); // Exibir notificação de sucesso
      },
      error => {
        console.error('Erro ao fazer upload do background:', error);
        this.toastr.error('Erro ao fazer upload do background.'); // Exibir notificação de erro
      }
    );
  }

  // Método para atualizar o background no style.css global
  updateGlobalBackground(url: string): void {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      body {
        background: url(${url}) no-repeat center center;
        background-size: cover;
      }
    `;
    document.head.appendChild(styleElement);
  }
}
