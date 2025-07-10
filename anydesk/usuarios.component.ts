import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { Observable, startWith, map } from 'rxjs';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['nome', 'email', 'status', 'acoes'];
  dataSource = new MatTableDataSource<any>([]);

  filtroNome = new FormControl('');
  nomesFiltrados!: Observable<string[]>;
  nomesUsuarios: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getUsuarios();
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

  getUsuarios() {
    this.dataService.getUsuarios().subscribe(
      (response) => {
        this.dataSource.data = response;
        console.log('Usuários obtidos:', response);
        this.nomesUsuarios = response.map((u: any) => u.nome);
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        this.dataSource.filterPredicate = (data: any, filter: string) =>
          data.nome.toLowerCase().includes(filter);
      },
      (error) => {
        console.error('Erro ao obter usuários:', error);
      }
    );
  }

  private _filterNomes(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.nomesUsuarios.filter(option => option.toLowerCase().includes(filterValue));
  }

  abrirModalEdicao(element: any) {
    // Lógica para abrir modal de edição
  }

  abrirModalExclusao(element: any) {
    // Lógica para abrir modal de exclusão
  }

  addUsuario() {
    // Lógica para adicionar usuário
  }

  toggleStatus(element: any) {
  const novoStatus = element.active === 1 ? 0 : 1;
  // Atualize localmente para feedback imediato
  element.active = novoStatus;
  // Chame o serviço para atualizar no backend, se necessário
  // this.dataService.toggleUsuarioStatus(element.id, novoStatus).subscribe(...)
}
}