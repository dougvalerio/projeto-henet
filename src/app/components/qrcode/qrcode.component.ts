import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-qrcode',
  standalone: true,
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css']
})
export class QrcodeComponent implements OnInit {
  qrCodeUrl: string = '../../../assets/qrcode-pz.png'; // Valor padrão

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    this.configService.currentQrcode.subscribe((qrCodeUrl: string) => {
      console.log('Novo QR Code recebido:', qrCodeUrl);  // Verificar se o URL do QR Code está correto
      this.qrCodeUrl = qrCodeUrl;  // Atualiza o QR Code exibido
    });
  }
}
