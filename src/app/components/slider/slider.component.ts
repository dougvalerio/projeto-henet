import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FotosService } from '../../services/fotos.service';
import { CommonModule } from '@angular/common';  // Para usar o ngFor
import { Imagem } from '../../models/imagem';
import { catchError, forkJoin, of, switchMap } from 'rxjs';
import { Observable } from 'rxjs';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class SliderComponent {

  ELEMENT_DATA: Imagem[] = [];
  imagensCarregadas: string[] = []; // Lista para guardar as URLs das imagens em base64

  currentQrCodeUrl = '../../../assets/qrcode.jpg'; // URL inicial do QR Code

  private intervalId: number | null = null;

  fotos: any[] = [];  // Array para armazenar as fotos
  foto: string | ArrayBuffer | null = null;
  //qrCode: string | ArrayBuffer | null = null;

  constructor(private fotosService: FotosService, private zone: NgZone) {}

  ngOnInit() {   
    this.findAll();
    //this.buscarFotoQrCodeServidor(1);
    
   // Configura o intervalo para atualizar o carrossel a cada 10 segundos fora da zona Angular
   this.zone.runOutsideAngular(() => {
    this.intervalId = window.setInterval(() => {
      this.zone.run(() => {
        this.findAll();
      });
    }, 10000);
  });
  }

  findAll(){
    this.fotosService.getCarrosselImagens().subscribe(resposta => {
        this.ELEMENT_DATA = resposta;
        this.baixarImagens();
    }, error => {
        console.error('Erro ao buscar imagens:', error);
    });
}

baixarImagens() {
  const observables = this.ELEMENT_DATA.map(imagem => this.buscarFotoServidor(imagem.id));
  forkJoin(observables).subscribe({
      next: (results) => {
          this.imagensCarregadas = results.filter(result => result != null);
          console.log('Todas as imagens foram baixadas e estão prontas para serem exibidas.');
      },
      error: (err) => {
          console.error('Erro ao baixar uma ou mais imagens:', err);
      }
  });
}

buscarFotoServidor(id: any): Observable<string> {
  return this.fotosService.getFoto(id).pipe(
      switchMap((blob: Blob) => new Observable<string>(observer => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
              observer.next(reader.result as string);
              observer.complete();
          };
          reader.onerror = (error) => {
              observer.error('Erro ao converter imagem');
          };
      })),
      catchError(error => {
          console.error('Erro ao carregar a imagem do servidor:', error);
          return of(''); // Retorna uma string vazia ou algum valor padrão em caso de erro
      })
  );
}


  buscarFotoQrCodeServidor(id: any) {
    this.fotosService.getQrcodeById(id).subscribe(
      (blob: Blob) => {
        console.info('Imagem QrCode baixada.');
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onload = () => {
            this.currentQrCodeUrl = reader.result as string;
          };
      },
      (error) => {
        if (error.status === 404) {
          console.error('Imagem não encontrada no servidor. Por favor, verifique o ID da imagem.');
          // Exibir uma mensagem de erro ao usuário informando que a imagem não foi encontrada
          // Por exemplo: this.mostrarMensagemErro('Imagem não encontrada. Verifique o ID da imagem.');
      } else {
          console.error('Erro ao carregar a imagem do servidor:', error);
          // Outros tratamentos de erro, se necessário
      }
      }
  );
  }

  carregarFotos() {
    this.fotosService.getAllImagens().subscribe(
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
  
  onSlideChange() {
    this.currentQrCodeUrl = `../../../assets/qrcode.jpg`;
      console.log('BAIXANDO NOVO QRCODE');
      this.buscarFotoQrCodeServidor(2);
  }
    
  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}