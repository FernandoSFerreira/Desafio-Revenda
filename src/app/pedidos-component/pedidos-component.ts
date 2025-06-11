import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { PedidoService } from '../Service/pedido-service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// Definindo a interface do Pedido para melhor tipagem
interface Pedido {
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

@Component({
    selector: 'app-pedidos-component',
    imports: [HttpClientModule, FormsModule, CommonModule, DatePipe, CurrencyPipe],
    templateUrl: './pedidos-component.html',
    styleUrls: ['./pedidos-component.scss']
})

export class PedidosComponent implements OnInit {

    pedidos: Pedido[] = [];
    novoPedido: any = {
        revendaId: '',
        dataPedido: '',
        observacoes: '',
        itens: ''
    };
    pedidoSelecionado: Pedido | null = null;

    constructor(
        private pedidoService: PedidoService, 
        private router: Router,
        private cdr: ChangeDetectorRef,
        private ngZone: NgZone
    ) {}

    ngOnInit(): void {
        console.log('Componente inicializado');
        this.carregarPedidos();
    }
    
    carregarPedidos(): void {
        console.log('Carregando pedidos...');
        // Limpar array primeiro
        this.pedidos = [];
        this.cdr.detectChanges();
        this.cdr.markForCheck();
        
        this.pedidoService.getPedidos().subscribe({
          next: (data: Pedido[]) => {
            console.log('Pedidos recebidos:', data);
            // Usar setTimeout para forçar nova detecção
            setTimeout(() => {
              this.pedidos = [...data];
              this.cdr.detectChanges();
              this.cdr.markForCheck();
            }, 0);
          },
          error: (err) => {
            console.error('Erro ao carregar pedidos:', err);
          }
        });
      }

    adicionarPedido(): void {
        console.log('Adicionando pedido:', this.novoPedido);
        this.pedidoService.criarPedido(this.novoPedido).subscribe({
            next: (response) => {
                console.log('Pedido criado com sucesso:', response);
                this.carregarPedidos();
                this.novoPedido = {
                    revendaId: '',
                    dataPedido: '',
                    observacoes: '',
                    itens: ''
                };
                // Fechar o modal programaticamente
                const modal = document.getElementById('adicionarPedidoModal');
                if (modal) {
                    const bootstrapModal = (window as any).bootstrap?.Modal?.getInstance(modal);
                    bootstrapModal?.hide();
                }
            },
            error: (err: any) => {
                console.error('Erro ao criar pedido:', err);
            }
        });
    }

    atualizarPedido(): void {
        if (this.pedidoSelecionado) {
            console.log('Atualizando pedido:', this.pedidoSelecionado);
            this.pedidoService.atualizarPedido(this.pedidoSelecionado).subscribe({
                next: (response) => {
                    console.log('Pedido atualizado com sucesso:', response);
                    this.carregarPedidos();
                    this.cancelarEdicao();
                },
                error: (err: any) => {
                    console.error('Erro ao atualizar pedido:', err);
                }
            });
        }
    }

    excluirPedido(id: string): void {
        if (confirm('Tem certeza que deseja excluir este pedido?')) {
            console.log('Excluindo pedido:', id);
            this.pedidoService.excluirPedido(id).subscribe({
                next: (response) => {
                    console.log('Pedido excluído com sucesso:', response);
                    this.carregarPedidos();
                },
                error: (err: any) => {
                    console.error('Erro ao excluir pedido:', err);
                }
            });
        }
    }

    selecionarPedidoParaEdicao(pedido: Pedido): void {
        console.log('Selecionando pedido para edição:', pedido);
        
        // Clona o objeto para evitar mutação direta e converte a data
        this.pedidoSelecionado = { 
            ...pedido,
            // Converte a data ISO para o formato datetime-local
            dataPedido: this.converterDataParaInput(pedido.dataPedido)
        };
        
        console.log('Pedido selecionado processado:', this.pedidoSelecionado);
        
        // Força a detecção de mudanças antes de abrir o modal
        this.cdr.detectChanges();
        
        // Aguarda um tick antes de abrir o modal
        setTimeout(() => {
            const modal = document.getElementById('editarPedidoModal');
            if (modal) {
                const bootstrapModal = new (window as any).bootstrap.Modal(modal);
                bootstrapModal.show();
            }
        }, 100);
    }

    cancelarEdicao(): void {
        this.pedidoSelecionado = null;
        // Fechar o modal de edição
        const modal = document.getElementById('editarPedidoModal');
        if (modal) {
            const bootstrapModal = (window as any).bootstrap?.Modal?.getInstance(modal);
            bootstrapModal?.hide();
        }
    }

    // Método para formatar a data para exibição
    formatarData(data: string): string {
        return new Date(data).toLocaleDateString('pt-BR');
    }

    // Método para formatar o valor monetário
    formatarValor(valor: number): string {
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    // Método para converter data ISO para formato datetime-local
    converterDataParaInput(dataISO: string): string {
        const data = new Date(dataISO);
        // Ajusta para o fuso horário local
        const offset = data.getTimezoneOffset();
        const dataLocal = new Date(data.getTime() - (offset * 60 * 1000));
        return dataLocal.toISOString().slice(0, 16);
    }

    // Método para trackBy no *ngFor (otimização)
    trackByPedidoId(index: number, item: Pedido): string {
        return item.id;
    }
}