import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RevendaService {
  private apiUrl = `${environment.apiUrl}/Revendas`;

  constructor(private http: HttpClient) {}

  getRevendas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getRevendaPorId(id: string) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getRevendaPorCnpj(cnpj: string) {
    return this.http.get(`${this.apiUrl}/cnpj/${cnpj}`);
  }

  criarRevenda(revenda: any) {
    return this.http.post(`${this.apiUrl}`, revenda);
  }

  atualizarRevenda(revenda: any) {
    return this.http.put(`${this.apiUrl}`, revenda);
  }

  excluirRevenda(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}