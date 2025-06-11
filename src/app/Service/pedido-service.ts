import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Pedido {
    id: string;
    revendaId: string;
    dataPedido: string;
    dataConfirmacao?: string | null;
    status: string;
    observacoes: string;
    valorTotal: number;
    quantidadeTotal: number;
    itens: any[];
}

@Injectable({
    providedIn: 'root'
})
export class PedidoService {

  private apiUrl = `${environment.apiUrl}/Pedidos`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // Método para buscar todos os pedidos
  getPedidos(): Observable<Pedido[]> {
    console.log('Fazendo requisição GET para:', this.apiUrl);
    return this.http.get<Pedido[]>(this.apiUrl, this.httpOptions)
      .pipe(
        retry(1), // Retry uma vez em caso de erro
        catchError(this.handleError)
      );
  }

  // Método para buscar um pedido por ID
  getPedidoPorId(id: string): Observable<Pedido> {
    const url = `${this.apiUrl}/${id}`;
    console.log('Fazendo requisição GET para:', url);
    return this.http.get<Pedido>(url, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // Método para criar um novo pedido
  criarPedido(pedido: any): Observable<Pedido> {
    console.log('Fazendo requisição POST para:', this.apiUrl, 'com dados:', pedido);
    return this.http.post<Pedido>(this.apiUrl, pedido, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Método para atualizar um pedido
  atualizarPedido(pedido: Pedido): Observable<Pedido> {
    const url = `${this.apiUrl}/${pedido.id}`;
    console.log('Fazendo requisição PUT para:', url, 'com dados:', pedido);
    return this.http.put<Pedido>(url, pedido, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Método para excluir um pedido
  excluirPedido(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    console.log('Fazendo requisição DELETE para:', url);
    return this.http.delete(url, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Método para tratamento de erros
  private handleError(error: HttpErrorResponse) {
    console.error('Erro HTTP:', error);
    
    let errorMessage = 'Erro desconhecido!';
    
    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do lado do servidor
      errorMessage = `Código do erro: ${error.status}\nMensagem: ${error.message}`;
      
      // Verificações específicas para problemas comuns
      if (error.status === 0) {
        errorMessage = 'Não foi possível conectar com o servidor. Verifique se a API está rodando em http://localhost:8080';
      } else if (error.status === 404) {
        errorMessage = 'Endpoint não encontrado. Verifique se a URL da API está correta.';
      } else if (error.status === 500) {
        errorMessage = 'Erro interno do servidor. Verifique os logs da API.';
      }
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // Método para testar a conexão com a API
  testarConexao(): Observable<any> {
    console.log('Testando conexão com a API...');
    return this.http.get(`${this.apiUrl.replace('/Pedidos', '')}/health`, { 
      ...this.httpOptions,
      responseType: 'text' as 'json'
    })
    .pipe(
      catchError((error) => {
        console.log('Endpoint de health não disponível, testando endpoint de pedidos...');
        return this.getPedidos();
      })
    );
  }
}
