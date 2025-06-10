import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PedidoService {

  private baseUrl = `${environment.apiUrl}/Pedidos`;

    constructor(private http: HttpClient) {}

    getPedidos(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}`);
    }

    criarPedido(pedido: any): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.baseUrl}`, pedido, {headers});
    }

    atualizarPedido(pedido: any): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.put(`${this.baseUrl}/${pedido.id}`, pedido, {headers});
    }

    excluirPedido(id: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${id}`);
    }
}
