import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-pdv',
  templateUrl: './pdv.component.html',
  styleUrls: ['./pdv.component.scss']
})
export class PdvComponent implements OnInit {
  @ViewChild('modalFinalizarVenda') modalFinalizarVenda!: TemplateRef<any>;  produtos: any[] = [];
  produtosFiltrados: any[] = [];
  produtoBusca: string = '';
  produtoSelecionado: any = null;
  quantidade: number = 1;
  itensVenda: any[] = [];

  clientes: any[] = [];
  clientesFiltrados: any[] = [];
  clienteBusca: string = '';
  clienteSelecionado: any = null;

  formasPagamento: any[] = [];
  formasPagamentoFiltradas: any[] = [];
  formaPagamentoBusca: string = '';
  formaPagamentoSelecionada: any = null;


  constructor(
    private dataService: DataService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getProdutos();
  this.getClientes();
  this.getFormasPagamento();
  }

  getProdutos() {
    this.dataService.getProdutos().subscribe((data: any[]) => {
      this.produtos = data;
      this.produtosFiltrados = data;
      console.log('Produtos carregados:', this.produtos);
    }, error => {
      console.error('Erro ao carregar produtos:', error);
    });
  }

  filtrarProdutos(valor: string) {
  const filtro = valor ? valor.toLowerCase() : '';
  this.produtosFiltrados = this.produtos.filter(prod =>
    prod.nome.toLowerCase().includes(filtro) || prod.id.toString().includes(filtro)
  );
  this.produtoSelecionado = null;
}

  selecionarProduto(event: MatAutocompleteSelectedEvent) {
  const nomeSelecionado = event.option.value;
  this.produtoSelecionado = this.produtos.find(prod => prod.nome === nomeSelecionado);
  this.produtoBusca = nomeSelecionado;
  console.log('Produto selecionado:', this.produtoSelecionado);
}

  adicionarProdutoSelecionado() {
  if (!this.produtoSelecionado) return;
  this.itensVenda.push({
    ...this.produtoSelecionado,
    quantidade: this.quantidade
  });
  // Limpa seleção e campo de busca
  this.produtoBusca = '';
  this.produtoSelecionado = null;
  this.quantidade = 1;
  // Atualiza produtosFiltrados para mostrar todos novamente
  this.produtosFiltrados = this.produtos;
  console.log('Produto adicionado:', this.itensVenda);
}

  get valorTotal(): number {
    return this.itensVenda.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  }

  removerItemVenda(index: number) {
  this.itensVenda.splice(index, 1);
}

finalizarVenda(cliente: any, formaPagamento: any) {
  const saida = {
    cliente_id: cliente.id,
    forma_pagamento: formaPagamento.nome,
    valor_total: this.valorTotal, // <-- Adicione esta linha!
    itens: this.itensVenda.map(item => ({
      produto_id: item.id,
      quantidade: item.quantidade,
      valor_venda: item.preco
    }))
  };

  this.dataService.postSaidas_produtos(saida).subscribe(
    (res) => {
      this.itensVenda = [];
      // Limpe também cliente, formaPagamento, busca, etc. se desejar
    },
    (err) => {
      console.error('Erro ao finalizar venda:', err);
    }
  );
}

getClientes() {
  this.dataService.getClientes().subscribe((data: any[]) => {
    this.clientes = data;
    this.clientesFiltrados = data;
  });
}

getFormasPagamento() {
  this.dataService.getFormasPagamento().subscribe((data: any[]) => {
    this.formasPagamento = data;
    this.formasPagamentoFiltradas = data;
  });
}

filtrarClientes(valor: string) {
  const filtro = valor ? valor.toLowerCase() : '';
  this.clientesFiltrados = this.clientes.filter(c => c.nome.toLowerCase().includes(filtro));
  this.clienteSelecionado = null;
}

selecionarCliente(event: MatAutocompleteSelectedEvent) {
  const nome = event.option.value;
  this.clienteSelecionado = this.clientes.find(c => c.nome === nome);
  this.clienteBusca = nome;
}

filtrarFormasPagamento(valor: string) {
  const filtro = valor ? valor.toLowerCase() : '';
  this.formasPagamentoFiltradas = this.formasPagamento.filter(f => f.nome.toLowerCase().includes(filtro));
  this.formaPagamentoSelecionada = null;
}

selecionarFormaPagamento(event: MatAutocompleteSelectedEvent) {
  const nome = event.option.value;
  this.formaPagamentoSelecionada = this.formasPagamento.find(f => f.nome === nome);
  this.formaPagamentoBusca = nome;
}

abrirModalFinalizarVenda() {
  this.dialog.open(this.modalFinalizarVenda);
}

}