import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../Service/usuario-service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Usuario {
  id: string;
  username: string;
  passwordHash: string;
}

@Component({
  selector: 'app-usuarios-component',
  imports: [HttpClientModule, FormsModule, CommonModule],
  templateUrl: './usuarios-component.html',
  styleUrls: ['./usuarios-component.scss']
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  novoUsuario: any = {
    username: '',
    password: ''
  };
  usuarioSelecionado: Usuario | null = null;

  constructor(
    private usuarioService: UsuarioService, 
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    console.log('Componente inicializado');
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    console.log('Carregando usuários...');
    this.usuarios = [];
    this.cdr.detectChanges();
    this.cdr.markForCheck();
    this.usuarioService.getUsuarios().subscribe({
      next: (data: Usuario[]) => {
        console.log('Usuários recebidos:', data);
        setTimeout(() => {
          this.usuarios = [...data];
          this.cdr.detectChanges();
          this.cdr.markForCheck();
        }, 0);
      },
      error: (err) => {
        console.error('Erro ao carregar usuários:', err);
      }
    });
  }

  adicionarUsuario(): void {
    console.log('Adicionando usuário:', this.novoUsuario);
    this.usuarioService.criarUsuario(this.novoUsuario).subscribe({
      next: (response) => {
        console.log('Usuário criado com sucesso:', response);
        this.carregarUsuarios();
        this.novoUsuario = { username: '', password: '' };
        const modal = document.getElementById('adicionarUsuarioModal');
        if (modal) {
          const bootstrapModal = (window as any).bootstrap?.Modal?.getInstance(modal);
          bootstrapModal?.hide();
        }
      },
      error: (err) => {
        console.error('Erro ao criar usuário:', err);
      }
    });
  }

  atualizarUsuario(): void {
    if (this.usuarioSelecionado) {
      console.log('Atualizando usuário:', this.usuarioSelecionado);
      this.usuarioService.atualizarUsuario(this.usuarioSelecionado).subscribe({
        next: (response) => {
          console.log('Usuário atualizado com sucesso:', response);
          this.carregarUsuarios();
          this.cancelarEdicao();
        },
        error: (err) => {
          console.error('Erro ao atualizar usuário:', err);
        }
      });
    }
  }

  excluirUsuario(id: string): void {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      console.log('Excluindo usuário:', id);
      this.usuarioService.excluirUsuario(id).subscribe({
        next: (response) => {
          console.log('Usuário excluído com sucesso:', response);
          this.carregarUsuarios();
        },
        error: (err) => {
          console.error('Erro ao excluir usuário:', err);
        }
      });
    }
  }

  selecionarUsuarioParaEdicao(usuario: Usuario): void {
    console.log('Selecionando usuário para edição:', usuario);
    this.usuarioSelecionado = { ...usuario };
    this.cdr.detectChanges();
    setTimeout(() => {
      const modal = document.getElementById('editarUsuarioModal');
      if (modal) {
        const bootstrapModal = new (window as any).bootstrap.Modal(modal);
        bootstrapModal.show();
      }
    }, 100);
  }

  cancelarEdicao(): void {
    this.usuarioSelecionado = null;
    const modal = document.getElementById('editarUsuarioModal');
    if (modal) {
      const bootstrapModal = (window as any).bootstrap?.Modal?.getInstance(modal);
      bootstrapModal?.hide();
    }
  }

  trackByUsuarioId(index: number, item: Usuario): string { return item.id; }
}