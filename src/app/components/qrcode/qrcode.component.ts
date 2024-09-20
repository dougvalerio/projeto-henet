import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-qrcode',
  standalone: true,
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css']
})
export class QrcodeComponent implements OnInit {

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
  }
}
