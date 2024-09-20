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
  menuActive = false;

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {

  }

  toggleMenu() {
    this.menuActive = !this.menuActive;
  }
}
