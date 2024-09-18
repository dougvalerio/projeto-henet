import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  
  //private apiUrl = 'http://177.38.244.53:9090/api/config'; // Substitua pela URL real do backend
  private apiUrl = 'http://localhost:8080/api/config';

  constructor(private http: HttpClient) { }

  // Método para fazer o upload do background
  uploadBackground(file: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.post<string>(`${this.apiUrl}/uploadBackground`, formData);
  }

  // Método para fazer o upload da moldura
  uploadMoldura(file: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.post<string>(`${this.apiUrl}/uploadMoldura`, formData);
  }

  // Método para buscar o background
  getBackground(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/background`, { responseType: 'blob' });
  }

  // Método para buscar a moldura
  getMoldura(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/moldura`, { responseType: 'blob' });
  }
}
