import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Usuario {
    id: string;
    username: string;
    passwordHash: string;
}

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = `${environment.apiUrl}/Usuario`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  // Método para buscar todos os usuários
  getUsuarios(): Observable<Usuario[]> {
    console.log('Fazendo requisição GET para:', this.apiUrl);
    return this.http.get<Usuario[]>(`${this.apiUrl}/ListarTodos`, this.httpOptions)
      .pipe(
        retry(1), // Retry uma vez em caso de erro
        catchError(this.handleError)
      );
  }

  // Método para buscar um usuário por ID
  getUsuarioPorId(id: string): Observable<Usuario> {
    const url = `${this.apiUrl}/ObterPorId/${id}`;
    console.log('Fazendo requisição GET para:', url);
    return this.http.get<Usuario>(url, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // Método para buscar um usuário por username
  getUsuarioPorUsername(username: string): Observable<Usuario> {
    const url = `${this.apiUrl}/ObterPorUsername/${username}`;
    console.log('Fazendo requisição GET para:', url);
    return this.http.get<Usuario>(url, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // Método para criar um novo usuário
  criarUsuario(usuario: any): Observable<Usuario> {
    console.log('Fazendo requisição POST para:', this.apiUrl, 'com dados:', usuario);
    return this.http.post<Usuario>(`${this.apiUrl}/Criar`, usuario, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Método para atualizar um usuário
  atualizarUsuario(usuario: Usuario): Observable<Usuario> {
    console.log('Fazendo requisição PUT para:', this.apiUrl, 'com dados:', usuario);
    return this.http.put<Usuario>(`${this.apiUrl}/Atualizar`, usuario, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Método para excluir um usuário
  excluirUsuario(id: string): Observable<any> {
    const url = `${this.apiUrl}/Deletar/${id}`;
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
}