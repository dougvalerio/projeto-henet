import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FotosService {

  private apiUrl = 'http://192.168.1.4:9090/api/fotos';

  constructor(private http: HttpClient) { }

  // Método para fazer o POST de uma nova foto
  uploadFoto(foto: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, foto);
  }

  // Método para fazer o GET de uma foto específica pelo ID
  getFotoById(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}`, { responseType: 'blob' });
  }

  // Método para fazer o GET de todas as fotos de um determinado ID
  getAllFotosById(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all/${id}`);
  }

  // Método específico para carregar o QR code
  getQrcodeById(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/qrcode`, { responseType: 'blob' });
  }
}
