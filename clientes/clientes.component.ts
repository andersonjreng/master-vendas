import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { Observable, startWith, map } from 'rxjs';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['nome', 'email', 'telefone', 'acoes'];
  dataSource = new MatTableDataSource<any>([]);

  filtroNome = new FormControl('');
  nomesFiltrados!: Observable<string[]>;
  nomesClientes: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getClientes();
    this.nomesFiltrados = this.filtroNome.valueChanges.pipe(
      startWith(''),
      map(value => this._filterNomes(value || ''))
    );

    this.filtroNome.valueChanges.subscribe(valor => {
      this.dataSource.filter = valor?.trim().toLowerCase() || '';
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getClientes() {
    this.dataService.getClientes().subscribe(
      (response) => {
        this.dataSource.data = response;
        this.nomesClientes = response.map((c: any) => c.nome);
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        this.dataSource.filterPredicate = (data: any, filter: string) =>
          data.nome.toLowerCase().includes(filter);
      },
      (error) => {
        console.error('Erro ao obter clientes:', error);
      }
    );
  }

  private _filterNomes(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.nomesClientes.filter(option => option.toLowerCase().includes(filterValue));
  }

  abrirModalEdicao(element: any) {
    // Lógica para abrir modal de edição
  }

  abrirModalExclusao(element: any) {
    // Lógica para abrir modal de exclusão
  }

  addCliente() {
    // Lógica para adicionar cliente
  }
}