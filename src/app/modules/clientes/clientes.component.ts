import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
// Removed MatPaginator import
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, startWith, map, of, Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { DataService } from '../../services/data.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit, AfterViewInit, OnDestroy {
  // Removed ngAfterViewChecked method

  loading: boolean = false;

  dadosCarregados: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild('modalCadastroCliente') modalCadastroCliente: any;
  formCliente: FormGroup;

  @ViewChild('modalEdicaoCliente') modalEdicaoCliente: any;
  formClienteEdicao: FormGroup;
  clienteSelecionado: any;

  displayedColumns = ['nome', 'email', 'telefone', 'ativo', 'acoes'];
  dataSource = new MatTableDataSource<any>([]);

  filtroNome = new FormControl('');
  nomesFiltrados: Observable<string[]> = of([]);
  nomesClientes: string[] = [];

  private subs: Subscription[] = [];

  // Paginator state
  length: number = 0;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageIndex: number = 0;

  // Removed paginator property

  constructor(
  private dialog: MatDialog,
  private fb: FormBuilder,
  private dataService: DataService,
  private toastr: ToastrService,
  private cdr: ChangeDetectorRef,

  ) {
    this.formCliente = this.fb.group({
    nome: ['', Validators.required],
    email: ['', [Validators.email]],
    telefone: ['']
  });
  this.formClienteEdicao = this.fb.group({
    nome: ['', Validators.required],
    email: ['', [Validators.email]],
    telefone: ['']
  });
  }

  ngOnInit(): void {
    this.getClientes();

    // Filter predicate should be set early so the table filtering works predictably
    this.dataSource.filterPredicate = (data: any, filter: string) =>
      (data.nome || '').toLowerCase().includes(filter);

    this.nomesFiltrados = this.filtroNome.valueChanges.pipe(
      startWith(''),
      map(value => this._filterNomes(value || ''))
    );

    const sub = this.filtroNome.valueChanges.subscribe(valor => {
      this.dataSource.filter = valor?.trim().toLowerCase() || '';
    });
    this.subs.push(sub);
  }

  ngAfterViewInit() {
    // assign paginator when view is initialized; if data already arrived, make sure to attach
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  // Removed ngAfterViewInit method

  getClientes() {
    this.loading = true;
    const obs = this.dataService.getClientes();
    if (obs && typeof obs.subscribe === 'function') {
      const sub = obs.subscribe(
        (response) => {
          this.dataSource.data = response;
          this.nomesClientes = response.map((c: any) => c.nome);
            // update paginator length and ensure paginator is attached
            this.length = this.dataSource.data.length;
            // paginator may be inside an *ngIf and not present yet. Force change
            // detection and attach it. If still unavailable, use a microtask
            // fallback (setTimeout 0) which runs after the view update.
            try {
              this.cdr.detectChanges();
            } catch (e) {
              // ignore; some environments may not allow explicit detection here
            }
            if (this.paginator) {
              this.dataSource.paginator = this.paginator;
            } else {
              setTimeout(() => {
                if (this.paginator) {
                  this.dataSource.paginator = this.paginator;
                }
              }, 0);
            }
          // paginator is assigned in ngAfterViewInit to avoid referencing the view
          this.dadosCarregados = true;
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          this.toastr.error('Erro ao obter clientes.', 'Erro');
        }
      );
      this.subs.push(sub);
    } else {
      this.loading = false;
      this.toastr.error('Não foi possível carregar os clientes. Verifique sua autenticação ou conexão.','Erro');
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    // dataSource.paginator already wired; updating pageSize/pageIndex is enough
    // ensure length stays in sync
    this.length = this.dataSource.data.length;
  }

  private _filterNomes(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.nomesClientes.filter(option => option.toLowerCase().includes(filterValue));
  }



  abrirModalExclusao(element: any) {
    // Lógica para abrir modal de exclusão
  }

  addCliente() {
  this.formCliente.reset();
  this.dialog.open(this.modalCadastroCliente);
}

salvarCliente() {
  if (this.formCliente.valid) {
    this.dataService.postClientes(this.formCliente.value).subscribe(
      (response) => {
        this.getClientes(); // Atualiza a lista
        this.dialog.closeAll();
        this.toastr.success('Cliente cadastrado com sucesso!', 'Sucesso');
      },
      (error) => {
        this.toastr.error('Erro ao cadastrar cliente.', 'Erro');
      }
    );
  }
}
// Método para abrir o modal de edição
abrirModalEdicao(element: any) {
  this.clienteSelecionado = element;
  this.formClienteEdicao.setValue({
    nome: element.nome,
    email: element.email,
    telefone: element.telefone
  });
  this.dialog.open(this.modalEdicaoCliente);
}

// Método para salvar a edição
salvarEdicaoCliente() {
  if (this.formClienteEdicao.valid) {
    const clienteEditado = {
      ...this.formClienteEdicao.value,
      id: this.clienteSelecionado.id
    };
    this.dataService.putCliente(clienteEditado).subscribe(
      (response) => {
        this.getClientes();
        this.dialog.closeAll();
        this.toastr.success('Cliente editado com sucesso!', 'Sucesso');
      },
      (error) => {
        this.toastr.error('Erro ao editar cliente.', 'Erro');
      }
    );
  }
}

alterarStatusCliente(cliente: any) {
  const novoStatus = cliente.ativo == 1 ? 0 : 1;
  this.dataService.putCliente({ id: cliente.id, ativo: novoStatus }).subscribe(
    () => {
      cliente.ativo = novoStatus;
      this.toastr.success('Status do cliente atualizado!', 'Sucesso');
    },
    () => {
      this.toastr.error('Erro ao atualizar status do cliente.', 'Erro');
    }
  );
}
}