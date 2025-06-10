import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
// import { Pedido } from '../models/pedido';
import { PedidoService } from '../Service/pedido-service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


@Component({
    selector: 'app-pedidos-component',
    imports: [HttpClientModule, FormsModule, CommonModule, DatePipe, CurrencyPipe],
    templateUrl: './pedidos-component.html',
    styleUrls: ['./pedidos-component.scss']
})
export class PedidosComponent implements OnInit {

    pedidos: any[] = [];
    novoPedido: any = {};
    pedidoSelecionado: any = null;

    constructor(private pedidoService: PedidoService, private router: Router) {}

    ngOnInit(): void {
        this.carregarPedidos();
    }
    
    carregarPedidos(): void {
      this.pedidoService.getPedidos().subscribe((data) => {
          this.pedidos = data;
      });
    }
  

    adicionarPedido(): void {
        this.pedidoService.criarPedido(this.novoPedido).subscribe({
            next: () => {
                this.carregarPedidos();
                this.novoPedido = {}; // Limpa o formulário
            },
            error: (err: any) => console.error('Erro ao criar pedido:', err)
        });
    }

    atualizarPedido(): void {
        if (this.pedidoSelecionado) {
            this.pedidoService.atualizarPedido(this.pedidoSelecionado).subscribe({
                next: () => {
                    this.carregarPedidos();
                    this.cancelarEdicao();
                },
                error: (err: any) => console.error('Erro ao atualizar pedido:', err)
            });
        }
    }

    excluirPedido(id: string): void {
        if (confirm('Tem certeza que deseja excluir este pedido?')) {
            this.pedidoService.excluirPedido(id).subscribe({
                next: () => this.carregarPedidos(),
                error: (err: any) => console.error('Erro ao excluir pedido:', err)
            });
        }
    }

    selecionarPedidoParaEdicao(pedido: any): void {
        this.pedidoSelecionado = pedido;
    }

    cancelarEdicao(): void {
        this.pedidoSelecionado = null;
    }
}
