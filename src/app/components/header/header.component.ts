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
  logoUrl: string = '../../../assets/logo-velejar.png'; // Valor padrão
  menuActive = false;

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    this.configService.currentLogo.subscribe((logoUrl: string) => {
      console.log('Logo URL received in header:', logoUrl); // Verifica a URL recebida
      if (logoUrl) {
        this.logoUrl = logoUrl; // Atualiza a logo quando o valor é alterado
      }
    });
  }

  toggleMenu() {
    this.menuActive = !this.menuActive;
  }
}
