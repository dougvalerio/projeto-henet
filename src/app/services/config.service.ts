import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  
  private apiUrl = 'http://177.38.244.53:9090/api/config'; // Substitua pela URL real do backend
  // private apiUrl = 'http://localhost:8080/api/config';

  constructor(private http: HttpClient) { }

  // Método para fazer o upload do Logo
  uploadLogo(file: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    // Definindo responseType como 'text' para tratar a resposta como uma string (URL da imagem)
    return this.http.post(`${this.apiUrl}/uploadLogo`, formData, { responseType: 'text' });
  }

  // Método para fazer o upload do Logo
  uploadBackground(file: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    // Definindo responseType como 'text' para tratar a resposta como uma string (URL da imagem)
    return this.http.post(`${this.apiUrl}/uploadBackground`, formData, { responseType: 'text' });
  }

  // Método para fazer o upload da moldura
  uploadMoldura(file: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.post<string>(`${this.apiUrl}/uploadMoldura`, formData);
  }

  // Método para fazer o upload do Logo
  uploadQrCode(file: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    // Definindo responseType como 'text' para tratar a resposta como uma string (URL da imagem)
    return this.http.post(`${this.apiUrl}/uploadQrCode`, formData, { responseType: 'text' });
  }

  // Método para buscar o Logo (blob)
  getLogo(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/logo`, { responseType: 'blob' });
  }

  // Método para buscar o background
  getBackground(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/background`, { responseType: 'blob' });
  }

  // Método para buscar a moldura
  getMoldura(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/moldura`, { responseType: 'blob' });
  }

  // Método para buscar a Qr Code
  getQrCode(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/qrCode`, { responseType: 'blob' });
  }
}
