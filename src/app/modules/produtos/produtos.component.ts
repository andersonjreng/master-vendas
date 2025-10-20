import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, startWith } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss']
})
export class ProdutosComponent implements OnInit {

  filtroAtivo: number = 1; // Por padrão, mostra só ativos
  produtosOriginais: any[] = [];

  loading: boolean = false;

  
  displayedColumns: string[] = ['nome', 'preco', 'grupo', 'custo', 'acoes'];
  dataSource = new MatTableDataSource<any>([]);

  filtroNome = new FormControl('');
  nomesFiltrados!: Observable<string[]>;
  nomesProdutos: string[] = [];

  @ViewChild('modalCadastroProduto') modalCadastroProduto: any;
  formProduto: FormGroup;

  @ViewChild('modalEdicaoProduto') modalEdicaoProduto: any;
  formProdutoEdicao: FormGroup;
  produtoSelecionado: any;

  @ViewChild('modalExclusaoProduto') modalExclusaoProduto: any;


  
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(
    private dataService: DataService, 
    private dialog: MatDialog,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) { 
    this.formProduto = this.fb.group({
    nome: ['', Validators.required],
    grupo: ['', Validators.required],
    preco: [0, [Validators.required, Validators.min(0)]],
    custo: [0, [Validators.required, Validators.min(0)]],
    ativo: [true]
  });
    this.formProdutoEdicao = this.fb.group({
      nome: ['', Validators.required],
      grupo: ['', Validators.required],
      preco: [0, [Validators.required, Validators.min(0)]],
      custo: [0, [Validators.required, Validators.min(0)]],
      ativo: [true]
    });
  }

  ngOnInit(): void {
    // Lógica de inicialização, se necessário
    this.getProdutos();
    this.nomesFiltrados = this.filtroNome.valueChanges.pipe(
      startWith(''),
      map(value => this._filterNomes(value || ''))
    );

        // Filtro da tabela ao digitar
    this.filtroNome.valueChanges.subscribe(valor => {
      this.filtrarPorStatus();
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

getProdutos() {
  this.loading = true;
  this.dataService.getProdutos().subscribe(
    (response) => {
      this.produtosOriginais = response; // Salva todos os produtos
      this.nomesProdutos = response.map((p: any) => p.nome);
      this.filtrarPorStatus(); // Aplica o filtro de status ao carregar
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      this.loading = false;

    },
    (error) => {
      console.error('Erro ao obter produtos:', error);
      this.loading = false;
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


abrirModalExclusao(element: any) {
  this.produtoSelecionado = element;
  this.dialog.open(this.modalExclusaoProduto);
}

abrirModalCadastro() {
  this.formProduto.reset({ ativo: true, preco: 0, custo: 0 });
  this.dialog.open(this.modalCadastroProduto);
}

salvarProduto() {
  if (this.formProduto.valid) {
    const produto = {
      ...this.formProduto.value,
      ativo: this.formProduto.value.ativo ? 1 : 0 // Converte para 1 ou 0
    };
    this.dataService.postProdutos(produto).subscribe(
      (response) => {
        console.log('Produto salvo com sucesso:', response);
        this.formProduto.reset({ ativo: true, preco: 0, custo: 0 });
        this.getProdutos(); // Atualiza a lista de produtos
        this.dialog.closeAll(); // Fecha o modal
        this.toastr.success('Produto cadastrado com sucesso!', 'Sucesso');
      },
      (error) => {
        console.error('Erro ao salvar produto:', error);
        this.toastr.error('Erro ao cadastrar produto. Tente novamente.', 'Erro');
      }
    );
  }
}

abrirModalEdicao(produto: any) {
  this.produtoSelecionado = produto;
  this.formProdutoEdicao.setValue({
    nome: produto.nome,
    grupo: produto.grupo,
    preco: produto.preco,
    custo: produto.custo,
    ativo: produto.ativo === 1
  });
  this.dialog.open(this.modalEdicaoProduto);
}

salvarEdicaoProduto() {
  if (this.formProdutoEdicao.valid) {
    const produtoEditado = {
      ...this.formProdutoEdicao.value,
      ativo: this.formProdutoEdicao.value.ativo ? 1 : 0,
      id: this.produtoSelecionado.id
    };
    this.dataService.putProduto(produtoEditado).subscribe(
      (response) => {
        this.getProdutos();
        this.dialog.closeAll();
        this.toastr.success('Produto editado com sucesso!', 'Sucesso');
      },
      (error) => {
        this.toastr.error('Erro ao editar produto.', 'Erro');
      }
    );
  }
}

confirmarExclusaoProduto() {
  this.dataService.deleteProduto(this.produtoSelecionado.id).subscribe(
    (response) => {
      this.getProdutos();
      this.dialog.closeAll();
      this.toastr.success('Produto excluído com sucesso!', 'Sucesso');
    },
    (error) => {
      this.toastr.error('Erro ao excluir produto.', 'Erro');
    }
  );
}

filtrarPorStatus() {
  const filtroNome = this.filtroNome.value?.trim().toLowerCase() || '';
  // Filtra sobre o array original
  let produtosFiltrados = this.produtosOriginais.filter((produto: any) => 
    String(produto.ativo) === String(this.filtroAtivo)
  );
  if (filtroNome) {
    produtosFiltrados = produtosFiltrados.filter((produto: any) =>
      produto.nome.toLowerCase().includes(filtroNome)
    );
  }
  this.dataSource.data = produtosFiltrados;
}

  limparFiltros() {
    this.filtroNome.setValue('');
    this.filtroAtivo = 1;
    this.filtrarPorStatus();
  }


 }