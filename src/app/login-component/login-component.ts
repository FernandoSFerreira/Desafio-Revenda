import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule  } from '@angular/forms';
import { AuthService } from '../Service/auth-service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './login-component.html',
  styleUrls: ['./login-component.scss']
})
export class LoginComponent {
    loginForm: FormGroup;
    isLoading = false;
    errorMessage = '';
  
    constructor(
      private fb: FormBuilder,
      private authService: AuthService
    ) {
      this.loginForm = this.fb.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required]]
      });
    }
  
    onSubmit(): void {
      if (this.loginForm.valid) {
        this.isLoading = true;
        this.errorMessage = '';
  
        const credentials = this.loginForm.value;
  
        this.authService.loginWithCredentials(credentials).subscribe({
          next: (response) => {
            this.isLoading = false;
            if (!response) {
              this.errorMessage = 'Credenciais inválidas. Tente novamente.';
            }
            // Se response existe, o login já foi processado no AuthService
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Erro no login:', error);
            
            // Personalizar mensagem de erro baseada no status
            if (error.status === 401) {
              this.errorMessage = 'Usuário ou senha incorretos.';
            } else if (error.status === 0) {
              this.errorMessage = 'Erro de conexão. Verifique sua internet.';
            } else {
              this.errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
            }
          }
        });
      } else {
        // Marcar todos os campos como touched para mostrar os erros
        Object.keys(this.loginForm.controls).forEach(key => {
          this.loginForm.get(key)?.markAsTouched();
        });
      }
    }
  }