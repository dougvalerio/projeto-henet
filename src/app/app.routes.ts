import { Routes } from '@angular/router';

import { SliderComponent } from './components/slider/slider.component';
import { GaleriaComponent } from './components/galeria/galeria.component';
import { UploadComponent } from './components/upload/upload.component';

export const routes: Routes = [
  {path: 'home', component: SliderComponent},
  {path: 'galeria', component: GaleriaComponent},
  {path: 'upload', component: UploadComponent},
];

