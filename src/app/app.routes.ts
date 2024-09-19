import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { GaleriaComponent } from './components/galeria/galeria.component';
import { UploadComponent } from './components/upload/upload.component';
import { QrcodeComponent } from './components/qrcode/qrcode.component';
import { ConfigComponent } from './components/config/config.component';
import { CarrosselComponent } from './components/carrossel/carrossel.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { ListafeedbackComponent } from './components/listafeedback/listafeedback.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redireciona o caminho vazio para /home
  { path: 'home', component: HomeComponent },
  { path: 'carrossel', component: CarrosselComponent },
  { path: 'galeria', component: GaleriaComponent },
  { path: 'qrcode', component: QrcodeComponent },
  { path: 'upload', component: UploadComponent },
  { path: 'config', component: ConfigComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'listafeedback', component: ListafeedbackComponent },
  // Adicione um wildcard route para redirecionar para /home em caso de rota inválida
  { path: '**', redirectTo: '/home' }
];