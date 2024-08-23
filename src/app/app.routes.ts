import { Routes } from '@angular/router';

import { SliderComponent } from './components/slider/slider.component';
import { GaleriaComponent } from './components/galeria/galeria.component';
import { UploadComponent } from './components/upload/upload.component';
import { QrcodeComponent } from './components/qrcode/qrcode.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redireciona o caminho vazio para /home
  { path: 'home', component: SliderComponent },
  { path: 'galeria', component: GaleriaComponent },
  { path: 'qrcode', component: QrcodeComponent },
  { path: 'upload', component: UploadComponent },
  // Adicione um wildcard route para redirecionar para /home em caso de rota inválida
  { path: '**', redirectTo: '/home' }
];