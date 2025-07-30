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
    this.findAll();
    this.loadLogo();
    this.loadQrCode();
    this.zone.runOutsideAngular(() => {
      this.intervalId = window.setInterval(() => {
        this.zone.run(() => {
          this.checkForNewVideos();
        });
      }, 10000);
    });
  }

  checkForNewVideos() {
    console.log('VERIFICANDO EXISTENCIA DE NOVO VÍDEO');
    this.videosService.getLastUpdatedTimestamp().subscribe(
      (timestamp: number) => {
        console.log('lastUpdatedTimestamp', this.lastUpdatedTimestamp);
        console.log('timestamp', timestamp);
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
        this.showQrCodePopup = true;
        setTimeout(() => {
          if (this.ELEMENT_DATA.length > 0) {
            const firstVideo = this.ELEMENT_DATA[0];
            this.buscarVideoQrCodeServidor(firstVideo.id);
            this.playActiveVideo(0); // Reproduzir o primeiro vídeo
          }
        }, 10000);
      },
      error: (err) => {
        console.error('Erro ao baixar um ou mais vídeos:', err);
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

  buscarVideoQrCodeServidor(id: any) {
    this.videosService.getQrcodeById(id).subscribe(
      (blob: Blob) => {
        console.info('QR Code do vídeo baixado.');
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => {
          this.qrCodeUrl = reader.result as string;
          console.log('QR Code atualizado:', this.qrCodeUrl);
        };
      },
      (error) => {
        if (error.status === 404) {
          console.error('QR Code não encontrado no servidor. Por favor, verifique o ID do vídeo.');
        } else {
          console.error('Erro ao carregar o QR Code do servidor:', error);
        }
      }
    );
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
        video.currentTime = 0; // Reiniciar o vídeo para o início
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
      if (activeVideo.readyState >= 2) { // HAVE_CURRENT_DATA ou superior
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

  closeQrCodePopup() {
    this.showQrCodePopup = false;
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

  loadQrCode(): void {
    this.configService.getQrCode().subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        this.qrCodeUrl = url;
        this.qrCodeBut = url;
        console.log('QR Code carregado com sucesso:', url);
      },
      error: (error) => {
        console.error('Erro ao carregar o QR Code:', error);
      }
    });
  }
}