import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-vendas',
  templateUrl: './vendas.component.html',
  styleUrls: ['./vendas.component.scss']
})
export class VendasComponent implements OnInit {

  loading: boolean = false;

  @ViewChild('modalProdutos') modalProdutos!: TemplateRef<any>;

  // Filtros
  intervaloDatas = { begin: new Date(), end: new Date() };
  clienteBusca: string = '';
  clienteSelecionado: any = null;
  clientes: any[] = [];
  clientesFiltrados: any[] = [];
  formasPagamento: any[] = [];
  formaPagamentoSelecionada: string = '';

  // Tabela
  saidas: any[] = [];
  colunasTabela = ['id', 'data_saida', 'cliente', 'valor_total', 'forma_pagamento', 'acoes'];

  // Modal produtos
  saidaSelecionada: any = null;
  produtosDaSaida: any[] = [];

  constructor(private dataService: DataService, private dialog: MatDialog) {}

  ngOnInit() {
    this.getClientes();
    this.getFormasPagamento();
    this.buscarVendas();
  }

  getClientes() {
    this.loading = true;
    this.dataService.getClientes().subscribe((data: any[]) => {
      this.clientes = data;
      this.clientesFiltrados = data;
      this.loading = false;
    }, (error) => {
      console.error('Erro ao obter clientes:', error);
      this.loading = false;
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

  getFormasPagamento() {
    this.dataService.getFormasPagamento().subscribe((data: any[]) => {
      this.formasPagamento = data;
    });
  }

buscarVendas() {
  console.log('Buscando vendas com filtros:', this.intervaloDatas, this.clienteSelecionado, this.formaPagamentoSelecionada);
  const dataInicioStr = this.intervaloDatas.begin ? this.intervaloDatas.begin.toISOString().slice(0, 10) : '';
  const dataFimStr = this.intervaloDatas.end ? this.intervaloDatas.end.toISOString().slice(0, 10) : '';

  const filtros = {
    data_inicio: dataInicioStr,
    data_fim: dataFimStr,
    cliente_id: this.clienteSelecionado ? this.clienteSelecionado.id : null,
    forma_pagamento: this.formaPagamentoSelecionada || null
  };
  this.dataService.getSaidas(filtros).subscribe((data: any[]) => {
    this.saidas = data;
  });
}

  abrirModalProdutos(saida: any) {
    this.saidaSelecionada = saida;
    this.dataService.getSaidasProdutos({ saida_id: saida.id }).subscribe((data: any[]) => {
      this.produtosDaSaida = data;
      this.dialog.open(this.modalProdutos);
    });
  }

  limparFiltros() {
  this.intervaloDatas = { begin: new Date(), end: new Date() };
  this.clienteBusca = '';
  this.clienteSelecionado = null;
  this.formaPagamentoSelecionada = '';
  this.buscarVendas();
}

  exportarParaExcel() {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.saidas);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendas');
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(data, `vendas_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

}