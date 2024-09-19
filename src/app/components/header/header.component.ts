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
  logoUrl: string = '../../../assets/logo-pz.png'; // Valor padrão
  menuActive = false;

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    // Escutar mudanças na logo a partir do serviço
    this.configService.currentLogo.subscribe((logoUrl: string) => {
      if (logoUrl) {
        this.logoUrl = logoUrl; // Atualiza a logo quando o valor é alterado
      }
    });
  }

  toggleMenu() {
    this.menuActive = !this.menuActive;
  }
}
