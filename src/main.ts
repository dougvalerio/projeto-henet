import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { register as registerSwiperElements } from 'swiper/element/bundle';

registerSwiperElements();

// Modificar appConfig para incluir o provideHttpClient
const extendedAppConfig = {
  ...appConfig,
  providers: [
    ...appConfig.providers || [], // Inclui qualquer provider já existente
    provideHttpClient()           // Adiciona o HttpClientModule
  ]
};

bootstrapApplication(AppComponent, extendedAppConfig)
  .catch((err) => console.error(err));