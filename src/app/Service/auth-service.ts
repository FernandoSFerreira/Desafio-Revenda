import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user?: any; // Ajuste conforme a estrutura da sua API
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
  private isBrowser: boolean;
  private apiUrl = environment.apiUrl+'/Auth';

  constructor(
    private router: Router,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    // Só verifica o token se estiver no browser
    if (this.isBrowser) {
      this.checkTokenValidity();
    }
  }

  private hasToken(): boolean {
    if (!this.isBrowser) {
      return false;
    }
    
    try {
      const token = localStorage.getItem('token');
      return token !== null && token !== undefined && token.trim() !== '';
    } catch (error) {
      console.warn('Erro ao acessar localStorage:', error);
      return false;
    }
  }

  private checkTokenValidity(): void {
    if (!this.isBrowser) {
      return;
    }

    const isValid = this.hasToken();
    this.isAuthenticatedSubject.next(isValid);
    
    // Só redireciona se não estiver na página de login
    if (!isValid && this.router.url !== '/login') {
      this.router.navigate(['/login']);
    }
  }

  // Método para fazer login via API
  loginWithCredentials(credentials: LoginRequest): Observable<LoginResponse | null> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials, { headers })
      .pipe(
        tap((response: LoginResponse) => {
          if (response && response.token) {
            this.login(response.token);
          }
        }),
        catchError((error) => {
          console.error('Erro no login:', error);
          // Você pode personalizar o tratamento de erro aqui
          return of(null);
        })
      );
  }

  // Método para validar token via API (opcional)
  validateToken(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      return of(false);
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`${this.apiUrl}/validate`, { headers })
      .pipe(
        tap(() => {
          this.isAuthenticatedSubject.next(true);
        }),
        catchError(() => {
          this.logout();
          return of(false);
        })
      );
  }

  login(token: string): void {
    if (!this.isBrowser) {
      console.warn('Login tentado fora do browser');
      return;
    }

    try {
      localStorage.setItem('token', token);
      this.isAuthenticatedSubject.next(true);
      console.log('Login realizado com sucesso!');
      this.router.navigate(['/pedidos']);
    } catch (error) {
      console.error('Erro ao salvar token:', error);
    }
  }

  logout(): void {
    if (!this.isBrowser) {
      return;
    }

    try {
      localStorage.removeItem('token');
    } catch (error) {
      console.warn('Erro ao remover token:', error);
    }
    
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (!this.isBrowser) {
      return null;
    }

    try {
      return localStorage.getItem('token');
    } catch (error) {
      console.warn('Erro ao obter token:', error);
      return null;
    }
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  // Método para obter headers com autorização
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // Método para inicialização manual no browser (se necessário)
  initializeInBrowser(): void {
    if (this.isBrowser) {
      this.checkTokenValidity();
    }
  }
}