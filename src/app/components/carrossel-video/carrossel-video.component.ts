import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, OnDestroy } from '@angular/core';
import { VideosService } from '../../services/videos.service';
import { ConfigService } from '../../services/config.service';
import { CommonModule } from '@angular/common';
import { Video } from '../../models/video';
import { catchError, forkJoin, of, switchMap } from 'rxjs';
import { Observable } from 'rxjs';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-carrossel-video',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrossel-video.component.html',
  styleUrl: './carrossel-video.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CarrosselVideoComponent implements OnInit, OnDestroy {
  logoUrl: string | null = null;
  qrCodeUrl: string | null = null;
  isLoading: boolean = true; // Controle de loading
  hasPopupBeenShown: boolean = false; // Controle para exibir popup apenas uma vez

  ELEMENT_DATA: Video[] = [];
  videosCarregados: string[] = [];

  qrCodeBut = '../../../assets/qrcode-pz.jpg';
  currentQrCodeUrl = '../../../assets/qrcode-pz.jpg';
  lastUpdatedTimestamp: number | null = null;

  private intervalId: number | null = null;
  showQrCodePopup = false;

  constructor(
    private videosService: VideosService,
    private configService: ConfigService,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.loadInitialData();
    this.zone.runOutsideAngular(() => {
      this.intervalId = window.setInterval(() => {
        this.zone.run(() => {
          this.checkForNewVideos();
        });
      }, 10000);
    });
  }

  loadInitialData() {
    this.isLoading = true;
    
    forkJoin({
      logo: this.configService.getLogo().pipe(catchError(() => of(null))),
      qrCode: this.configService.getQrCode().pipe(catchError(() => of(null))),
      videos: this.videosService.getCarrosselVideos()
    }).subscribe({
      next: ({ logo, qrCode, videos }) => {
        // Processa logo
        if (logo) {
          this.logoUrl = URL.createObjectURL(logo);
        }

        // Processa QR Code inicial para o popup
        if (qrCode) {
          this.qrCodeBut = URL.createObjectURL(qrCode);
        }

        // Processa vídeos
        this.ELEMENT_DATA = videos.sort((a, b) => b.id - a.id);
        this.baixarVideos();
      },
      error: (error) => {
        console.error('Erro ao carregar dados iniciais:', error);
        this.isLoading = false;
        if (!this.hasPopupBeenShown) {
          this.showQrCodePopup = true;
          this.hasPopupBeenShown = true;
        }
      }
    });
  }

  checkForNewVideos() {
    console.log('VERIFICANDO EXISTENCIA DE NOVO VÍDEO');
    this.videosService.getLastUpdatedTimestamp().subscribe(
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
    this.videosService.getCarrosselVideos().subscribe(
      (resposta) => {
        this.ELEMENT_DATA = resposta.sort((a, b) => b.id - a.id);
        this.baixarVideos();
      },
      (error) => {
        console.error('Erro ao buscar vídeos:', error);
      }
    );
  }

  baixarVideos() {
    const observables = this.ELEMENT_DATA.map((video) => this.buscarVideoServidor(video.id));
    forkJoin(observables).subscribe({
      next: (results) => {
        this.videosCarregados = results.filter((result) => result != null);
        console.log('Todos os vídeos foram baixados e estão prontos para serem exibidos:', this.videosCarregados);
        
        if (this.ELEMENT_DATA.length > 0) {
          this.buscarVideoQrCodeServidor(this.ELEMENT_DATA[0].id).subscribe({
            next: () => {
              this.isLoading = false;
              if (!this.hasPopupBeenShown) {
                this.showQrCodePopup = true;
                this.hasPopupBeenShown = true;
              }
              this.playActiveVideo(0); // Reproduzir o primeiro vídeo
            },
            error: () => {
              this.isLoading = false;
              if (!this.hasPopupBeenShown) {
                this.showQrCodePopup = true;
                this.hasPopupBeenShown = true;
              }
            }
          });
        } else {
          this.isLoading = false;
          if (!this.hasPopupBeenShown) {
            this.showQrCodePopup = true;
            this.hasPopupBeenShown = true;
          }
        }
      },
      error: (err) => {
        console.error('Erro ao baixar um ou mais vídeos:', err);
        this.isLoading = false;
        if (!this.hasPopupBeenShown) {
          this.showQrCodePopup = true;
          this.hasPopupBeenShown = true;
        }
      }
    });
  }

  buscarVideoServidor(id: any): Observable<string> {
    return this.videosService.getVideo(id).pipe(
      switchMap((blob: Blob) => new Observable<string>((observer) => {
        console.log(`Carregando vídeo com ID ${id}, tipo: ${blob.type}, tamanho: ${blob.size} bytes`);
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            observer.next(reader.result);
            observer.complete();
          } else {
            observer.error('Erro: resultado do FileReader não é uma string');
          }
        };
        reader.onerror = (error) => {
          console.error(`Erro ao converter vídeo com ID ${id}:`, error);
          observer.error('Erro ao converter vídeo');
        };
      })),
      catchError((error) => {
        console.error(`Erro ao carregar o vídeo do servidor com ID ${id}:`, error);
        return of('');
      })
    );
  }

  buscarVideoQrCodeServidor(id: any): Observable<void> {
    return new Observable<void>((observer) => {
      this.videosService.getQrcodeById(id).subscribe({
        next: (blob: Blob) => {
          console.info('QR Code do vídeo baixado.');
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onload = () => {
            this.qrCodeUrl = reader.result as string;
            console.log('QR Code atualizado:', this.qrCodeUrl);
            observer.next();
            observer.complete();
          };
          reader.onerror = () => observer.error('Erro ao converter QR Code');
        },
        error: (error) => observer.error(error)
      });
    });
  }

  onSlideChange(event: any) {
    console.log('Atualizando QR Code e controlando reprodução de vídeo');
    const swiper = event.target;
    const currentIndex = swiper.realIndex;
    const currentVideo = this.ELEMENT_DATA[currentIndex];

    // Pausar todos os vídeos
    const videos = document.querySelectorAll('swiper-slide video');
    videos.forEach((video, index) => {
      if (video instanceof HTMLVideoElement) {
        video.pause();
        video.currentTime = 0;
        console.log(`Vídeo ${index} pausado`);
      }
    });

    // Reproduzir o vídeo do slide atual
    this.playActiveVideo(currentIndex);

    // Atualizar o QR Code
    if (currentVideo) {
      this.buscarVideoQrCodeServidor(currentVideo.id);
    }
  }

  playActiveVideo(index: number) {
    const activeSlide = document.querySelectorAll('swiper-slide')[index];
    const activeVideo = activeSlide?.querySelector('video');
    if (activeVideo instanceof HTMLVideoElement) {
      console.log(`Tentando reproduzir vídeo no slide ${index}: ${activeVideo.src}`);
      if (activeVideo.readyState >= 2) {
        activeVideo.play().catch((error) => {
          console.error(`Erro ao reproduzir vídeo no slide ${index}:`, error);
        });
      } else {
        activeVideo.addEventListener(
          'canplay',
          () => {
            console.log(`Vídeo no slide ${index} pronto para reprodução: ${activeVideo.src}`);
            activeVideo.play().catch((err) => {
              console.error(`Erro ao reproduzir vídeo no slide ${index} após canplay:`, err);
            });
          },
          { once: true }
        );
      }
    } else {
      console.warn(`Nenhum vídeo válido encontrado no slide ${index}`);
    }
  }

  closeQrCodePopup() {
    this.showQrCodePopup = false;
    this.hasPopupBeenShown = true; // Garante que o popup não será reaberto
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    // Pausar todos os vídeos ao destruir o componente
    const videos = document.querySelectorAll('swiper-slide video');
    videos.forEach((video) => {
      if (video instanceof HTMLVideoElement) {
        video.pause();
        video.currentTime = 0;
      }
    });
  }
}