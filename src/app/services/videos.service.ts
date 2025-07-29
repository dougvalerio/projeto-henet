import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Video } from '../models/video';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class VideosService {

  private apiUrl = `${API_CONFIG.baseUrl}/api/videos`;

  constructor(private http: HttpClient) { }

  // Método para fazer o POST de um novo vídeo
  uploadVideo(video: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/upload`, video);
  }

  // Método para fazer o GET de um vídeo específico pelo ID
  getVideo(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/video`, { responseType: 'blob' });
  }

  // Método para fazer o GET de todos os vídeos
  getAllVideos(): Observable<Video[]> {
    return this.http.get<Video[]>(`${this.apiUrl}`);
  }

  // Método para fazer o GET dos últimos 5 vídeos do carrossel
  getCarrosselVideos(): Observable<Video[]> {
    return this.http.get<Video[]>(`${this.apiUrl}/carrossel`);
  }

  // Método para obter o timestamp da última atualização
  getLastUpdatedTimestamp(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/last-updated`);
  }

  // Método específico para carregar o QR code de um vídeo
  getQrcodeById(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/qrcode`, { responseType: 'blob' });
  }

  // Método para deletar um vídeo pelo ID
  delete(id: any): Observable<Video> {
    return this.http.delete<Video>(`${this.apiUrl}/${id}`);
  }
}