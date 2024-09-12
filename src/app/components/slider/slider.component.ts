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

  qrCodeBut = '../../../assets/qrcode-be2b.jpg'; 
  currentQrCodeUrl = '../../../assets/qrcode-be2b.jpg'; // URL inicial do QR Code
  lastUpdatedTimestamp: number | null = null; // Timestamp da última atualização

  private intervalId: number | null = null;

  fotos: any[] = [];  // Array para armazenar as fotos
  foto: string | ArrayBuffer | null = null;
  //qrCode: string | ArrayBuffer | null = null;

  showQrCodePopup = false; // Controle de visibilidade do popup

  constructor(private fotosService: FotosService, private zone: NgZone) {}

  ngOnInit() {   
    this.findAll();
    // Configura o intervalo para atualizar o carrossel a cada 10 segundos fora da zona Angular
    this.zone.runOutsideAngular(() => {
      this.intervalId = window.setInterval(() => {
        this.zone.run(() => {
          this.checkForNewImages();
        });
      }, 10000);
    });
  }

  checkForNewImages() {
    console.log('VERIFICANDO EXISTENCIA DE NOVA IMAGEM');

    this.fotosService.getLastUpdatedTimestamp().subscribe(
      (timestamp: number) => {
        console.log('lastUpdatedTimestamp', this.lastUpdatedTimestamp);
        console.log('timestamp', timestamp);
        if (this.lastUpdatedTimestamp === null || timestamp > this.lastUpdatedTimestamp) {1
          this.lastUpdatedTimestamp = timestamp;
          this.findAll();          
        }
      },
      (error) => {
        console.error('Erro ao obter o timestamp da última atualização:', error);
      }
    );
  }

  findAll(){
    this.fotosService.getCarrosselImagens().subscribe(resposta => {
        // Ordenar a lista de imagens por ID em ordem decrescente
        this.ELEMENT_DATA = resposta.sort((a, b) => b.id - a.id);
        //this.ELEMENT_DATA = resposta;
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
        
        // this.currentQrCodeUrl = '../../../assets/qrcode-bot.png'; // URL inicial do QR Code
        this.showQrCodePopup = true; // Exibe o popup com o QR code inicial

        // Adicionar um delay de 10 segundos antes de buscar o QR Code
        setTimeout(() => {
          // Atualizar o QR Code com a primeira imagem do carrossel 
          if (this.ELEMENT_DATA.length > 0) {
            const firstImagem = this.ELEMENT_DATA[0];
            this.buscarFotoQrCodeServidor(firstImagem.id);
          }
        }, 10000); // 10000 milissegundos = 10 segundos
          
      },
      error: (err) => {
        console.error('Erro ao baixar uma ou mais imagens:', err);
      }
    });
  }

  closeQrCodePopup() {
    this.showQrCodePopup = false; // Fecha o popup
  }

  buscarFotoServidor(id: any): Observable<string> {
    return this.fotosService.getImagem(id).pipe(
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
          //this.currentQrCodeUrl = '../../../assets/qrcode-bot.png'; // URL inicial do QR Code

          this.currentQrCodeUrl = reader.result as string;
          console.log('QR Code atualizado:', this.currentQrCodeUrl);
                    
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
        // Pegar as últimas 5 fotos, assumindo que o array esteja em ordem cronológica
        this.fotos = response.slice(-5).reverse();  // Inverter a ordem para exibir da mais recente para a mais antiga

        console.log("Exibindo as últimas 5 fotos: ", this.fotos);
      },
      (error) => {
        console.error('Erro ao carregar fotos:', error);
      }
    );
  }

  onSlideChange(event: any) {
    console.log("Atualizando QrCode");

    const swiper = event.target;
    const currentIndex = swiper.realIndex;
    const currentImagem = this.ELEMENT_DATA[currentIndex];
    if (currentImagem) {
      this.buscarFotoQrCodeServidor(currentImagem.id);
    }
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}