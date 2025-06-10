import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  constructor(private http: HttpClient) {}

  getProdutos() {
    return this.http.get(`${environment.apiUrl}/Produtos`);
  }

  criarProduto(produto: any) {
    return this.http.post(`${environment.apiUrl}/Produtos`, produto);
  }

  atualizarProduto(produto: any) {
    return this.http.put(`${environment.apiUrl}/Produtos/${produto.id}`, produto);
  }

  excluirProduto(id: string) {
    return this.http.delete(`${environment.apiUrl}/Produtos/${id}`);
  }
}