import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl = 'http://177.38.244.53:9090/api/depoimentos'; // ajuste conforme o seu servidor

  constructor(private http: HttpClient) { }

  // Headers para requisições
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // Método para buscar todos os depoimentos
  getAllDepoimentos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  // Método para buscar depoimento por ID
  getDepoimentoById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Método para buscar o timestamp do último depoimento
  getLastUpdatedTimestamp(): Observable<any> {
    return this.http.get(`${this.apiUrl}/last-updated`);
  }

  // Método para criar um novo depoimento
  createDepoimento(depoimento: any): Observable<any> {
    return this.http.post(this.apiUrl, depoimento, this.httpOptions);
  }

  // Método para deletar um depoimento
  deleteDepoimento(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
