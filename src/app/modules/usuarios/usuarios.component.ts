import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, startWith, map } from 'rxjs';
import { DataService } from '../../services/data.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit, AfterViewInit {

  @ViewChild('modalCadastroUsuario') modalCadastroUsuario: any;
  formUsuario: FormGroup;
  empresas: any[] = [];

  @ViewChild('modalEdicaoUsuario') modalEdicaoUsuario: any;
  formUsuarioEdicao: FormGroup;
  usuarioSelecionado: any;

  displayedColumns: string[] = ['nome', 'email', 'status', 'acoes'];
  dataSource = new MatTableDataSource<any>([]);

  filtroNome = new FormControl('');
  nomesFiltrados!: Observable<string[]>;
  nomesUsuarios: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
  private dialog: MatDialog,
  private fb: FormBuilder,
  private dataService: DataService,
  private toastr: ToastrService
  ) {
      this.formUsuario = this.fb.group({
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', Validators.required],
    permissao: ['', Validators.required],
    empresa_id: ['', Validators.required]
  });
  this.formUsuarioEdicao = this.fb.group({
  nome: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  permissao: ['', Validators.required],
  empresa_id: ['', Validators.required],
  senha: [''] // campo opcional
});
  }

  ngOnInit(): void {
    this.getUsuarios();
    this.nomesFiltrados = this.filtroNome.valueChanges.pipe(
      startWith(''),
      map(value => this._filterNomes(value || ''))
    );

    this.filtroNome.valueChanges.subscribe(valor => {
      this.dataSource.filter = valor?.trim().toLowerCase() || '';
    });
    this.getEmpresas();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getEmpresas() {
  this.dataService.getEmpresas().subscribe(
    (response) => {
      this.empresas = response;
    },
    (error) => {
      this.toastr.error('Erro ao carregar empresas.', 'Erro');
    }
  );
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
  this.usuarioSelecionado = element;
  this.formUsuarioEdicao.setValue({
    nome: element.nome,
    email: element.email,
    permissao: element.permissao,
    empresa_id: element.empresa_id,
    senha: '' // sempre vazio ao abrir
  });
  this.dialog.open(this.modalEdicaoUsuario);
}

// Método para salvar a edição
salvarEdicaoUsuario() {
  if (this.formUsuarioEdicao.valid) {
    const usuarioEditado: any = {
      ...this.formUsuarioEdicao.value,
      id: this.usuarioSelecionado.id
    };
    // Se senha não foi informada, remove do objeto
    if (!usuarioEditado.senha) {
      delete usuarioEditado.senha;
    }
    this.dataService.putUsuario(usuarioEditado).subscribe(
      (response) => {
        this.getUsuarios();
        this.dialog.closeAll();
        this.toastr.success('Usuário editado com sucesso!', 'Sucesso');
      },
      (error) => {
        this.toastr.error('Erro ao editar usuário.', 'Erro');
      }
    );
  }
}

  abrirModalExclusao(element: any) {
    // Lógica para abrir modal de exclusão
  }

addUsuario() {
  this.formUsuario.reset();
  this.dialog.open(this.modalCadastroUsuario);
}

  salvarUsuario() {
    if (this.formUsuario.valid) {
      console.log('Formulário válido:', this.formUsuario.value);
      this.dataService.postUsuarios(this.formUsuario.value).subscribe(
        (response) => {
          this.getUsuarios();
          this.dialog.closeAll();
          this.toastr.success('Usuário cadastrado com sucesso!', 'Sucesso');
        },
        (error) => {
          this.toastr.error('Erro ao cadastrar usuário.', 'Erro');
        }
      );
    }
  }

  toggleStatus(element: any) {
  const novoStatus = element.active === 1 ? 0 : 1;
  // Atualize localmente para feedback imediato
  element.active = novoStatus;
  // Chame o serviço para atualizar no backend, se necessário
  // this.dataService.toggleUsuarioStatus(element.id, novoStatus).subscribe(...)
}
}