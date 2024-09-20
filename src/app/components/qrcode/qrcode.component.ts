import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-qrcode',
  standalone: true,
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css']
})

export class QrcodeComponent implements OnInit {
  qrCodeUrl: string | null = null;

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    this.loadQrCode(); // Carrega o QR Code ao inicializar o componente
  }

  loadQrCode(): void {
    this.configService.getQrCode().subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        this.qrCodeUrl = url; // Define a URL do QR Code para o template
        console.log('QR Code carregado com sucesso:', url);
      },
      error: (error) => {
        console.error('Erro ao carregar o QR Code:', error);
      }
    });
  }
}