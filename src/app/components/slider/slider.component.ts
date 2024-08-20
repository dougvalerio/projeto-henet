import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FotosService } from '../../services/fotos.service';
import { CommonModule } from '@angular/common';  // Para usar o ngFor

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SliderComponent {
  fotos: any[] = [];  // Array para armazenar as fotos

  constructor(private fotosService: FotosService) {}

  ngOnInit() {
    this.carregarFotos();  // Carregar as fotos ao iniciar o componente
  }

  carregarFotos() {
    this.fotosService.getAllFotos().subscribe(
      (response) => {
        // Pegar as últimas 10 fotos, assumindo que o array esteja em ordem cronológica
        this.fotos = response.slice(-10).reverse();  // Inverter a ordem para exibir da mais recente para a mais antiga

        console.log("Exibindo as últimas 10 fotos: ", this.fotos);
      },
      (error) => {
        console.error('Erro ao carregar fotos:', error);
      }
    );
  }
}