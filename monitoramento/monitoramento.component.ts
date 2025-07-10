import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-monitoramento',
  templateUrl: './monitoramento.component.html',
  styleUrls: ['./monitoramento.component.scss']
})
export class MonitoramentoComponent implements OnInit {
  isSubmittingModal: boolean = false;
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  atendimentoDelete!: any;
  dateRange: { start: Date | null, end: Date | null } = { start: new Date(), end: new Date() };
  filtros: any = {
    atendente: '',
    usina: '',
    tipoChamado: '',
    dataAtendimento: ''
  };
  tipoChamadoSelecionado: string | null = null;
  atendentesDisponiveis: string[] = [];
  atendenteFilter = new FormControl('');
  usinaFilter = new FormControl('');
  tipoChamadoFilter = new FormControl('');
  problemaRelatadoFilter = new FormControl('');
  dataAtendimentoFilter = new FormControl('');
  permissionUser: string = '';
  userName: string = '';
  monitoramentoForm!: FormGroup;
  atendimentoEdit!: any;
  editForm!: FormGroup;
  tiposChamados: string[] = [
    'CRIAÇÃO DE RELATÓRIO',
    'ACESSO A USINA FORA DE EXPEDIENTE',
    'REABASTECIMENTO DO SILO',
    'INCONFORMIDADES',
    'SOLICITAÇÃO DE REPAROS',
    'OUTRO'
  ];
  tiposRelatorios: string[] = [
    'CONFORMIDADE USINA',
    'CARGAS SEM ANEXO',
    'DESCARREGAMENTO INDEVIDO',
    'AUDITORIA',
    'REQUISIÇÃO DE MANUTENÇÃO DE CAMERAS'
  ];
  tiposExpedientes: string[] = ['DIURNO', 'NOTURNO'];
  foiAvisadoOptions: string[] = ['SIM', 'NÃO'];
  foiIdentificadoOptions: string[] = ['SIM', 'NÃO'];

  usinaControl = new FormControl();
  filteredUsinas!: Observable<string[]>;
  usinas: string[] = []; 
  usinaKeyword: string = '';
  usinaKeywordName: string = '';

  displayedColumns: string[] = [
    'id',
    'atendente',
    'usina',
    'solicitante',
    'dataAtendimento',
    'inicioDoAtendimento',
    'fimDoAtendimento',
    'tipoChamado', 
    'observacao', 
    'acoes'
  ];

  constructor(private fb: FormBuilder, private dataService: DataService, private toastr: ToastrService, private datePipe: DatePipe) { }

  ngOnInit() {

    this.editForm = this.fb.group({
      atendente: ['', Validators.required],
      usina: ['', Validators.required],
      solicitante: ['', Validators.required],
      tipoChamado: ['', Validators.required],
      tipoRelatorio: [''],
      tipoExpediente: [''],
      foiAvisado: [''],
      colaboradorAvisado: [''],
      foiIdentificado: [''],
      dataAtendimento: ['', Validators.required],
      inicioDoAtendimento: ['', Validators.required],
      fimDoAtendimento: ['', Validators.required],
      observacao: ['']
    });

    const today = new Date();
    this.getAtendimentos(today, today);

    this.getAtendentes();

    this.dataService.getUsinas().subscribe(data => {
      console.log(data)
      this.usinas = data.map((usina: any) => usina.nome_usina);
      console.log(this.usinas)
      
    });
    this.monitoramentoForm = this.fb.group({
      usina: ['', Validators.required],
      solicitante: ['', Validators.required],
      tipoChamado: ['', Validators.required],
      dataAtendimento: ['', Validators.required],
      inicioDoAtendimento: ['', Validators.required],
      fimDoAtendimento: ['', Validators.required],
      observacao: [''],
      tipoRelatorio: [''],
      tipoExpediente: [''],
      foiAvisado: [''],
      colaboradorAvisado: [''],
      foiIdentificado: ['']
    });

    this.filteredUsinas = this.usinaControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this.buscarDadosDoUsuario();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.usinas.filter(option => option.toLowerCase().includes(filterValue));
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  displayFnUsina(usina: string): string {
    return usina;
  }

  optionSelectedUsina(event: any) {
    this.usinaKeywordName = event.option.value;
    this.monitoramentoForm.get('usina')?.setValue(event.option.value);
  }

  choseUsina(option: string) {
    this.usinaKeyword = option;
  }

  filterUsinas() {
    this.filteredUsinas = this.usinaControl.valueChanges.pipe(
      startWith(this.usinaKeyword),
      map(value => this._filter(value))
    );
  }

  onTipoChamadoChange(tipoChamado: string) {
    this.tipoChamadoSelecionado = tipoChamado;
    // this.verificarChamadosRecorrentes(tipoChamado);
    if (tipoChamado === 'CRIAÇÃO DE RELATÓRIO') {
      this.monitoramentoForm.get('tipoRelatorio')?.setValidators(Validators.required);
      this.monitoramentoForm.get('tipoRelatorio')?.updateValueAndValidity();
    } else {
      this.monitoramentoForm.get('tipoRelatorio')?.clearValidators();
      this.monitoramentoForm.get('tipoRelatorio')?.setValue('');
      this.monitoramentoForm.get('tipoRelatorio')?.updateValueAndValidity();
    }

    if (tipoChamado === 'ACESSO A USINA FORA DE EXPEDIENTE') {
      this.monitoramentoForm.get('tipoExpediente')?.setValidators(Validators.required);
      this.monitoramentoForm.get('tipoExpediente')?.updateValueAndValidity();
    } else {
      this.monitoramentoForm.get('tipoExpediente')?.clearValidators();
      this.monitoramentoForm.get('tipoExpediente')?.setValue('');
      this.monitoramentoForm.get('tipoExpediente')?.updateValueAndValidity();
    }

    if (tipoChamado !== 'ACESSO A USINA FORA DE EXPEDIENTE') {
      this.monitoramentoForm.get('foiAvisado')?.clearValidators();
      this.monitoramentoForm.get('foiAvisado')?.setValue('');
      this.monitoramentoForm.get('foiAvisado')?.updateValueAndValidity();
      this.monitoramentoForm.get('colaboradorAvisado')?.clearValidators();
      this.monitoramentoForm.get('colaboradorAvisado')?.setValue('');
      this.monitoramentoForm.get('colaboradorAvisado')?.updateValueAndValidity();
      this.monitoramentoForm.get('foiIdentificado')?.clearValidators();
      this.monitoramentoForm.get('foiIdentificado')?.setValue('');
      this.monitoramentoForm.get('foiIdentificado')?.updateValueAndValidity();
    }
  }

  onTipoExpedienteChange(tipoExpediente: string) {
    if (tipoExpediente === 'NOTURNO') {
      this.monitoramentoForm.get('foiAvisado')?.setValidators(Validators.required);
      this.monitoramentoForm.get('foiAvisado')?.updateValueAndValidity();
    } else {
      this.monitoramentoForm.get('foiAvisado')?.clearValidators();
      this.monitoramentoForm.get('foiAvisado')?.setValue('');
      this.monitoramentoForm.get('foiAvisado')?.updateValueAndValidity();
      this.monitoramentoForm.get('colaboradorAvisado')?.clearValidators();
      this.monitoramentoForm.get('colaboradorAvisado')?.setValue('');
      this.monitoramentoForm.get('colaboradorAvisado')?.updateValueAndValidity();
      this.monitoramentoForm.get('foiIdentificado')?.clearValidators();
      this.monitoramentoForm.get('foiIdentificado')?.setValue('');
      this.monitoramentoForm.get('foiIdentificado')?.updateValueAndValidity();
    }
  }

  onFoiAvisadoChange(foiAvisado: string) {
    if (foiAvisado === 'SIM') {
      this.monitoramentoForm.get('colaboradorAvisado')?.setValidators(Validators.required);
      this.monitoramentoForm.get('colaboradorAvisado')?.updateValueAndValidity();
      this.monitoramentoForm.get('foiIdentificado')?.clearValidators();
      this.monitoramentoForm.get('foiIdentificado')?.setValue('');
      this.monitoramentoForm.get('foiIdentificado')?.updateValueAndValidity();
    } else {
      this.monitoramentoForm.get('colaboradorAvisado')?.clearValidators();
      this.monitoramentoForm.get('colaboradorAvisado')?.setValue('');
      this.monitoramentoForm.get('colaboradorAvisado')?.updateValueAndValidity();
      this.monitoramentoForm.get('foiIdentificado')?.setValidators(Validators.required);
      this.monitoramentoForm.get('foiIdentificado')?.updateValueAndValidity();
    }
  }

  onSubmit() {
    if (this.monitoramentoForm.valid) {
      console.log(this.monitoramentoForm.value);
      
        const novoRegistro = this.monitoramentoForm.value;
        const payload = {
          ...novoRegistro,
          atendente: this.userName
        };
        this.toastr.warning('Trabalhando na sua solicitação');
        console.log(payload)
        this.dataService.addChamadoMonitoramento(payload).subscribe(
          response => {
            console.log('Registro inserido com sucesso:', response);
            this.toastr.success('Registro criado com sucesso');
            window.location.reload();
          },
          error => {
            console.error('Erro ao criar registro:', error);
            this.toastr.error('Erro ao criar registro');
            
          }
        );
    }
  }

  onSubmitEdit() {
    if (this.editForm.valid) {
      console.log(this.editForm.value);
      console.log(this.atendimentoEdit)
        const novoRegistro = this.editForm.value;
        // Certifique-se de que o `id` do atendimento a ser editado está disponível no form
        if (!this.atendimentoEdit.id) {
          this.toastr.error('ID da liberação não encontrado!');
          return;
        }
       
        this.toastr.warning('Trabalhando na sua solicitação');
        console.log(novoRegistro)
        this.dataService.updateMonitoramento(this.atendimentoEdit.id, novoRegistro).subscribe(
          response => {
            console.log('Registro editado com sucesso:', response);
            this.toastr.success('Registro editado com sucesso');
            window.location.reload();
          },
          error => {
            console.error('Erro ao editar registro:', error);
            this.toastr.error('Erro ao editar registro');
            
          }
        );
    }
  }

  buscarDadosDoUsuario() {
    const currentUserJson = sessionStorage.getItem('currentUser')
    if (currentUserJson) {
      const currentUser = JSON.parse(currentUserJson);
      this.userName = currentUser.username;
      this.permissionUser = currentUser.permission;
      console.log(this.permissionUser)
    }
  }

  // applyFilter(event: any, field: string) {
  //   const filterValue = event.value || event.target?.value || '';
    
  //   this.filtros[field] = filterValue.trim().toLowerCase(); // Atualiza o objeto de filtros
  
  //   this.dataSource.filter = JSON.stringify(this.filtros); // Aplica a filtragem
  // }

  applyFilter(event: any, field: string) {
    const filterValue = event.value || event.target?.value || '';
    this.filtros[field] = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const parsedFilter = JSON.parse(filter);
      return Object.keys(parsedFilter).every(key => {
        if (!parsedFilter[key]) {
          return true; // Ignora filtros vazios
        }
        const dataValue = String(data[key]).toLowerCase();
        const filterValueForKey = parsedFilter[key];
        return dataValue.includes(filterValueForKey);
      });
    };
    this.dataSource.filter = JSON.stringify(this.filtros);
  }

  // verificarChamadosRecorrentes(tipoChamado: string): void {
  //   if (!tipoChamado) {
  //     return;
  //   }

  //   const hoje = new Date();
  //   const dataInicio = new Date();
  //   dataInicio.setDate(hoje.getDate() - 30);

  //   const dataInicioFormatada = this.datePipe.transform(dataInicio, 'yyyy-MM-dd');
  //   const hojeFormatado = this.datePipe.transform(hoje, 'yyyy-MM-dd');

  //   if (dataInicioFormatada && hojeFormatado) {
  //     this.dataService.getChamadosLiberacoes(
  //       dataInicioFormatada,
  //       hojeFormatado
  //     ).pipe(
  //       catchError((error: any) => {
  //         console.error('Erro ao verificar chamados recorrentes:', error);
  //         this.toastr.error('Erro ao verificar chamados recorrentes.', 'Erro');
  //         return of([]);
  //       })
  //     ).subscribe((registros: any[]) => {
  //       const chamadosRecorrentes = registros.filter(
  //         registro => registro.tipoChamado === tipoChamado
  //       );
  //       if (chamadosRecorrentes.length >= 2) {
  //         this.toastr.warning('CHAMADO RECORRENTE, FAVOR AUDITAR.', 'Atenção');
  //       }
  //     });
  //   } else {
  //     console.error('Erro ao formatar as datas para a verificação de chamados recorrentes.');
  //     this.toastr.error('Erro interno ao verificar chamados recorrentes.', 'Erro');
  //   }
  // }
  

  getAtendentes() {

  }

  chamadaTeste(): void {
    console.log('Intervalo de datas selecionado:', this.dateRange.start);
    this.getAtendimentos(this.dateRange.start, this.dateRange.end);
  }

  getAtendimentos(startDate: Date | null, endDate: Date | null): void {
    console.log(startDate, endDate);
    if (startDate && endDate) { // Verifique se as datas não são nulas
        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = endDate.toISOString().split('T')[0];
        
        this.dataService.getChamadosMonitoramento(formattedStartDate, formattedEndDate).pipe(
            catchError((error: any) => {
                // Verifica se o erro é relacionado a "No records found"
                if (error.error && error.error.error === 'No records found') {
                    this.toastr.warning(
                        'Não há registros para o intervalo selecionado.',
                        'Nenhum Registro'
                    );
                } else {
                    console.error('Erro ao carregar registros: ', error);
                    this.toastr.error(
                        'Ocorreu um erro ao carregar. Tente novamente mais tarde.',
                        'Erro'
                    );
                }
                this.dataSource.data = []; // Limpa os dados da tabela
                
                return of([]); // Retorna um array vazio em caso de erro
            })
        ).subscribe(data => {
            console.log('Dados recebidos: ', data);
            this.dataSource.data = data; // Atualiza o dataSource com os dados recebidos
            this.updateFilters(data); // Atualiza os filtros, se necessário
            this.atendentesDisponiveis = data
              .map((item: any) => item.atendente) // Extrai os nomes
              .filter((nome: any, index: any, self: any) => self.indexOf(nome) === index); // Remove duplicados

            // Atualiza o paginator caso necessário
            if (this.paginator) {
                this.dataSource.paginator = this.paginator;
            }
        });
    } else {
        console.log('Selecione o intervalo');
    }
}

updateFilters(data: any[]): void {
  this.atendentesDisponiveis = [...new Set(data.map(item => item.atendente))];
  this.usinas = [...new Set(data.map(item => item.usina))];
  // this.tiposChamados = [...new Set(data.map(item => item.tipoChamado))];
}

clearFilters(): void {
  this.filtros = {
    atendente: '',
    usina: '',
    tipoChamado: '',
    codContrato: '',
    dataAtendimento: ''
  };
  
  this.atendenteFilter.reset();
  this.usinaFilter.reset();
  this.tipoChamadoFilter.reset();
  this.dataAtendimentoFilter.reset();


  const today = new Date();
    this.getAtendimentos(today, today)
}

exportToExcel(): void {
  // Pega apenas os dados filtrados
  const data = this.dataSource.filteredData.map(row => {
    const { acoes, ...rest } = row;
    return rest;
  });

  // Criação da planilha
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // Exportação para arquivo Excel
  XLSX.writeFile(workbook, 'atendimentos_liberacoes_concrelagos.xlsx');
}


  editarLiberacao(element: any) {
    console.log(element)
  }

  openModalExcluir(element: any) {
    this.atendimentoDelete = element;
    console.log(this.atendimentoDelete)
    const modal = document.getElementById('card-modal-delete');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  openModal(id: string) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.style.display = 'block';
    }
  }

  closeModal(id: string) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.style.display = 'none';
    }
  }

  editarRegistro(element: any) { 
    this.atendimentoEdit = element;
    this.editForm = this.fb.group({
      atendente: [element.atendente, Validators.required],
      usina: [element.usina, Validators.required],
      solicitante: [element.solicitante, Validators.required],
      tipoChamado: [element.tipoChamado, Validators.required],
      dataAtendimento: [element.dataAtendimento, Validators.required],
      inicioDoAtendimento: [element.inicioDoAtendimento, Validators.required],
      fimDoAtendimento: [element.fimDoAtendimento, Validators.required],
      observacao: [element.observacao],
      tipoRelatorio: [element.tipoRelatorio],
      tipoExpediente: [element.tipoExpediente],
      foiAvisado: [element.foiAvisado],
      colaboradorAvisado: [element.colaboradorAvisado],
      foiIdentificado: [element.foiIdentificado]
    });
    console.log(element)
    console.log(this.editForm)
    this.openModal('card-modal-edit')
  }

  excluirAtendimento(): void {
    const element = this.atendimentoDelete;
    if (element) {
      this.isSubmittingModal = true;
      console.log(element);
      console.log(element.id);
      this.toastr.warning('Trabalhando na sua solicitação');
      this.dataService.deleteChamadoMonitoramento(element.id).subscribe(
        response => {
          console.log('Registro excluído com sucesso:', response);
          this.toastr.success('Registro excluído com sucesso');
          this.isSubmittingModal = false;
          const today = new Date();
          this.getAtendimentos(today, today); // Atualiza a lista de atendimentos
          this.closeModal('card-modal-delete');
        },
        error => {
          console.error('Erro ao excluir registro:', error);
          this.toastr.error('Erro ao excluir registro');
          this.isSubmittingModal = false;
        }
      );
    }
  }

  }
  