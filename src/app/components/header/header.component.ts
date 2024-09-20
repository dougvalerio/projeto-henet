import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  logoUrl: string | null = null;
  menuActive = false;

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {

  }
  
  loadQrCode(): void {
    this.configService.getQrCode().subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        this.logoUrl = url; // Define a URL do QR Code para o template
        console.log('QR Code carregado com sucesso:', url);
      },
      error: (error) => {
        console.error('Erro ao carregar o QR Code:', error);
      }
    });
  }

  toggleMenu() {
    this.menuActive = !this.menuActive;
  }
}
