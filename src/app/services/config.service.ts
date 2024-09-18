import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private baseUrl = 'http://177.38.244.53:9090/api/config'; // Substitua pela URL real do backend

  constructor(private http: HttpClient) { }

  // Método para fazer o upload do background
  uploadBackground(file: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.post<string>(`${this.baseUrl}/uploadBackground`, formData);
  }

  // Método para fazer o upload da moldura
  uploadMoldura(file: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.post<string>(`${this.baseUrl}/uploadMoldura`, formData);
  }

  // Método para buscar o background
  getBackground(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/background`, { responseType: 'blob' });
  }

  // Método para buscar a moldura
  getMoldura(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/moldura`, { responseType: 'blob' });
  }
}
