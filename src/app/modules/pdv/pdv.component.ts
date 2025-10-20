import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';

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

  @ViewChild('modalCadastroCliente') modalCadastroCliente!: TemplateRef<any>;
  formCliente: FormGroup;


  constructor(
    private dataService: DataService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) { 
    this.formCliente = this.fb.group({
      nome: [''],
      email: [''],
      telefone: ['']
    });
  }

  ngOnInit(): void {
    this.getProdutos();
  this.getClientes();
  this.getFormasPagamento();
  }

  getProdutos() {
    this.dataService.getProdutos().subscribe((data: any[]) => {
      this.produtos = data;
      // Exibe apenas produtos ativos inicialmente
      this.produtosFiltrados = data.filter(prod => String(prod.ativo) === '1');
      console.log('Produtos carregados:', this.produtos);
    }, error => {
      console.error('Erro ao carregar produtos:', error);
    });
  }

  filtrarProdutos(busca: string) {
  const termo = busca ? busca.toLowerCase() : '';
  this.produtosFiltrados = this.produtos
    .filter(prod => String(prod.ativo) === '1') // Só produtos ativos
    .filter(prod =>
      prod.nome.toLowerCase().includes(termo) ||
      String(prod.id).includes(termo)
    );
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
  // Atualiza produtosFiltrados para mostrar apenas ativos novamente
  this.produtosFiltrados = this.produtos.filter(prod => String(prod.ativo) === '1');
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
      this.fecharModalFinalizarVenda();
      this.toastr.success('Venda finalizada com sucesso!');
      console.log('Venda finalizada:', res);
    },
    (err) => {
      console.error('Erro ao finalizar venda:', err);
      this.toastr.error('Erro ao finalizar venda. Tente novamente.');
    }
  );
}

getClientes() {
  this.dataService.getClientes().subscribe(clientes => {
    this.clientes = clientes;
    this.clientesFiltrados = clientes;
  });
  console.log('Clientes carregados:', this.clientes);
}

getFormasPagamento() {
  this.dataService.getFormasPagamento().subscribe((data: any[]) => {
    this.formasPagamento = data;
    this.formasPagamentoFiltradas = data;
  });
}

filtrarClientes(valor: string) {
  const filtro = valor.toLowerCase().trim();
  this.clientesFiltrados = this.clientes.filter(c =>
    c.nome.toLowerCase().includes(filtro)
  );
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

fecharModalFinalizarVenda() {
  this.dialog.closeAll();
}

abrirModalCadastroCliente(nome: string) {
  this.formCliente.reset({ nome });
  this.dialog.open(this.modalCadastroCliente);
}

salvarCliente() {
  if (this.formCliente.valid) {
    this.dataService.postClientes(this.formCliente.value).subscribe(
      (clienteNovo) => {
        this.getClientes(); // Atualiza lista de clientes
        this.clienteSelecionado = clienteNovo;
        this.clienteBusca = clienteNovo.nome;
        this.dialog.closeAll();
        this.toastr.success('Cliente cadastrado com sucesso!');
      },
      () => this.toastr.error('Erro ao cadastrar cliente.')
    );
  }
}

}