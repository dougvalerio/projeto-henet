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
    this.loadLogo(); 
  }

  loadLogo(): void {
    this.configService.getLogo().subscribe({ 
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        this.logoUrl = url;
        console.log('Logo carregada com sucesso:', url);
      },
      error: (error) => {
        console.error('Erro ao carregar a logo:', error);
      }
    });
  }

  toggleMenu() {
    this.menuActive = !this.menuActive;
  }
}