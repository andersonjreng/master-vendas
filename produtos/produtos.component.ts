import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, startWith } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss']
})
export class ProdutosComponent implements OnInit {
  
  displayedColumns: string[] = ['nome', 'preco', 'custo', 'acoes'];
  dataSource = new MatTableDataSource<any>([]);

  filtroNome = new FormControl('');
  nomesFiltrados!: Observable<string[]>;
  nomesProdutos: string[] = [];

  
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(
    private dataService: DataService, 
  ) { }

  ngOnInit(): void {
    // Lógica de inicialização, se necessário
    this.getProdutos();
    this.nomesFiltrados = this.filtroNome.valueChanges.pipe(
      startWith(''),
      map(value => this._filterNomes(value || ''))
    );

        // Filtro da tabela ao digitar
    this.filtroNome.valueChanges.subscribe(valor => {
      this.dataSource.filter = valor?.trim().toLowerCase() || '';
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getProdutos() {
    this.dataService.getProdutos().subscribe(
      (response) => {
        this.dataSource.data = response;
        this.nomesProdutos = response.map((p: any) => p.nome);
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        // Configura o filtro para pesquisar apenas pelo nome
        this.dataSource.filterPredicate = (data: any, filter: string) =>
          data.nome.toLowerCase().includes(filter);
      },
      (error) => {
        console.error('Erro ao obter produtos:', error);
      }
    );
  }

    private _filterNomes(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.nomesProdutos.filter(option => option.toLowerCase().includes(filterValue));
  }

  addProdutos() {
    // Lógica para abrir o modal de adição de produto
    alert('Abrir modal de adição de produto');
  }

  abrirModalEdicao(element: any) {
  // Lógica para abrir o modal de edição e passar o produto selecionado
  alert(element.nome + ' - ' + element.preco);
}

abrirModalExclusao(element: any) {
  // Lógica para abrir o modal de exclusão e passar o produto selecionado
  alert(element.nome + ' - ' + element.preco);
}



 }