      import { Injectable } from '@angular/core';
      import { HttpClient } from '@angular/common/http';
      import { Observable } from 'rxjs';
      import { Imagem } from '../models/imagem';

      @Injectable({
        providedIn: 'root'
      })
      export class FotosService {

        private apiUrl = 'http://177.38.244.53:9090/api/fotos';
        // private apiUrl = 'http://localhost:8080/api/fotos';

        constructor(private http: HttpClient) { }
      
        // Método para fazer o POST de uma nova foto
        uploadFoto(foto: FormData): Observable<any> {
          return this.http.post<any>(`${this.apiUrl}`, foto);
        }

        // Método para fazer o GET de uma foto específica pelo ID
        getImagem(id: number): Observable<Blob> {
          return this.http.get(`${this.apiUrl}/${id}/imagem`, { responseType: 'blob' });
        }
      
        // Método para fazer o GET de todas as fotos
        getAllImagens(): Observable<Imagem[]> {
          return this.http.get<Imagem[]>(`${this.apiUrl}`);
        }

        // Método para fazer o GET das ultimas 5 fotos do carrossel
        getCarrosselImagens(): Observable<Imagem[]> {
          return this.http.get<Imagem[]>(`${this.apiUrl}/carrossel`);
        }

        getLastUpdatedTimestamp(): Observable<number> {
          return this.http.get<number>(`${this.apiUrl}/last-updated`);
        }
      
        // Método específico para carregar o QR code
        getQrcodeById(id: number): Observable<Blob> {
          return this.http.get(`${this.apiUrl}/${id}/qrcode`, { responseType: 'blob' });
        }

        delete(id: any): Observable<Imagem> {
          return this.http.delete<Imagem>(`${this.apiUrl}/${id}`);
        }
      }
