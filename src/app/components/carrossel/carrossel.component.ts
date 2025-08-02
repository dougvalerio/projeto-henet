import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FotosService } from '../../services/fotos.service';
import { CommonModule } from '@angular/common';
import { Imagem } from '../../models/imagem';
import { catchError, forkJoin, of, switchMap } from 'rxjs';
import { Observable } from 'rxjs';
import { NgZone } from '@angular/core';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-carrossel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrossel.component.html',
  styleUrl: './carrossel.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CarrosselComponent implements OnInit {
  logoUrl: string | null = null;
  qrCodeUrl: string | null = null;
  isLoading: boolean = true;
  showQrCodePopup = false;

  ELEMENT_DATA: Imagem[] = [];
  imagensCarregadas: string[] = [];

  qrCodeBut = '../../../assets/velejar.jpg';
  currentQrCodeUrl = '../../../assets/velejar.jpg';
  lastUpdatedTimestamp: number | null = null;
  lastImageId: number | null = null;

  private intervalId: number | null = null;

  fotos: any[] = [];

  constructor(
    private fotosService: FotosService,
    private configService: ConfigService,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.loadInitialData();
    this.zone.runOutsideAngular(() => {
      this.intervalId = window.setInterval(() => {
        this.zone.run(() => {
          this.checkForNewImages();
        });
      }, 10000);
    });
  }

  loadInitialData() {
    this.isLoading = true;
    
    forkJoin({
      logo: this.configService.getLogo().pipe(catchError(() => of(null))),
      qrCode: this.configService.getQrCode().pipe(catchError(() => of(null))),
      imagens: this.fotosService.getCarrosselImagens()
    }).subscribe({
      next: ({ logo, qrCode, imagens }) => {
        // Processa logo
        if (logo) {
          this.logoUrl = URL.createObjectURL(logo);
        }

        // Processa QR Code inicial para o popup
        if (qrCode) {
          this.qrCodeBut = URL.createObjectURL(qrCode);
        }

        // Processa imagens
        this.ELEMENT_DATA = imagens.sort((a, b) => b.id - a.id);
        if (this.ELEMENT_DATA.length > 0) {
          this.lastImageId = this.ELEMENT_DATA[0].id; // Armazena o ID da imagem mais recente
        }
        this.baixarImagens(true); // Exibe o popup na primeira carga
      },
      error: (error) => {
        console.error('Erro ao carregar dados iniciais:', error);
        this.isLoading = false;
        this.showQrCodePopup = true; // Exibe o popup em caso de erro
      }
    });
  }

  checkForNewImages() {
    console.log('VERIFICANDO EXISTENCIA DE NOVA IMAGEM');

    this.fotosService.getLastUpdatedTimestamp().subscribe(
      (timestamp: number) => {
        if (this.lastUpdatedTimestamp === null || timestamp > this.lastUpdatedTimestamp) {
          this.lastUpdatedTimestamp = timestamp;
          this.findAll();
        }
      },
      (error) => {
        console.error('Erro ao obter o timestamp da última atualização:', error);
      }
    );
  }

  findAll() {
    this.fotosService.getCarrosselImagens().subscribe(
      resposta => {
        const novasImagens = resposta.sort((a, b) => b.id - a.id);
        const newLastImageId = novasImagens.length > 0 ? novasImagens[0].id : null;

        // Verifica se há uma nova imagem (ID diferente do último carregado)
        if (newLastImageId !== null && newLastImageId !== this.lastImageId) {
          this.ELEMENT_DATA = novasImagens;
          this.lastImageId = newLastImageId; // Atualiza o ID da última imagem
          this.baixarImagens(true); // Passa true para indicar que é uma nova imagem
        } else {
          this.ELEMENT_DATA = novasImagens;
          this.baixarImagens(false); // Sem nova imagem, não exibe popup
        }
      },
      error => {
        console.error('Erro ao buscar imagens:', error);
      }
    );
  }

  baixarImagens(showPopupForNewImage: boolean = false) {
    const observables = this.ELEMENT_DATA.map(imagem => this.buscarFotoServidor(imagem.id));
    forkJoin(observables).subscribe({
      next: (results) => {
        this.imagensCarregadas = results.filter(result => result != null);
        
        if (this.ELEMENT_DATA.length > 0) {
          this.buscarFotoQrCodeServidor(this.ELEMENT_DATA[0].id).subscribe({
            next: () => {
              this.isLoading = false;
              if (showPopupForNewImage) {
                this.showQrCodePopup = true; // Exibe o popup para nova imagem ou carga inicial
              }
            },
            error: () => {
              this.isLoading = false;
              if (showPopupForNewImage) {
                this.showQrCodePopup = true; // Exibe o popup mesmo em caso de erro
              }
            }
          });
        } else {
          this.isLoading = false;
          this.showQrCodePopup = true; // Exibe o popup se não houver imagens
        }
      },
      error: (err) => {
        console.error('Erro ao baixar imagens:', err);
        this.isLoading = false;
        this.showQrCodePopup = true; // Exibe o popup em caso de erro
      }
    });
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
        reader.onerror = () => observer.error('Erro ao converter imagem');
      })),
      catchError(() => of(''))
    );
  }

  buscarFotoQrCodeServidor(id: any): Observable<void> {
    return new Observable<void>(observer => {
      this.fotosService.getQrcodeById(id).subscribe({
        next: (blob: Blob) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onload = () => {
            this.qrCodeUrl = reader.result as string;
            observer.next();
            observer.complete();
          };
          reader.onerror = () => observer.error('Erro ao converter QR Code');
        },
        error: (error) => observer.error(error)
      });
    });
  }

  carregarFotos() {
    this.fotosService.getAllImagens().subscribe(
      (response) => {
        this.fotos = response.slice(-5).reverse();
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

  closeQrCodePopup() {
    this.showQrCodePopup = false;
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}