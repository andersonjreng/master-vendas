import { DataService } from '@/src/app/services/data.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { Observable, of, startWith } from 'rxjs';
import { map } from 'jquery';


interface Destinatario {
  email: string;
  name?: string;
}

interface DestinatariosPorNivel {
  ADMINISTRATIVO: Destinatario[];
  'SEGURANÇA DO TRABALHO': Destinatario[];
  OPERAÇÃO: Destinatario[];
  VENDAS: Destinatario[];
  DEFAULT: Destinatario[];
}

@Component({
  selector: 'app-rh',
  templateUrl: './rh.component.html',
  styleUrls: ['./rh.component.scss']
})
export class RhComponent implements OnInit {

  idFinalizar: any;
  elementFinalizar: any;

  userName: string = '';
  permissionUser: string = '';
  permissionUserCode: string = '';
  isLoading: boolean = false; 
  solicitacoesRh: any[] = [
    
  ]
  elementNegado: any;
  observacaoNegada: string = '';
  filtrosStatus: string[] = ['TODOS', 'PENDENTE', 'APROVADO', 'NEGADO', 'FINALIZADO'];
  filtrosStatusMatriz: string[] = ['TODOS', 'APROVADO', 'FINALIZADO'];
  filtroStatusSelecionado: string | null = 'TODOS';
  usinasUnicas: string[] = ['TODAS']; // Inclui 'TODAS' como opção inicial
  filtroUsinaControl = new FormControl('TODAS'); // FormControl para o select de usinas
  dateRange: { start: Date | null; end: Date | null } = { start: null, end: null };
  tiposVagaUnicos: string[] = ['TODOS']; // Novo filtro
  filtroTipoVagaControl = new FormControl('TODOS');
  solicitacoesFiltradas: any[] = [];
  colaboradorForm!: FormGroup;
  editForm!: FormGroup;
  tamanhosUniforme: string[] = [
    'PP',
    'P',
    'M',
    'G',
    'GG'
  ]

  // variaveis do edit

  isMatriz: boolean = false;


  usinasDisponiveis: string[] = [
  ];
  usinaControl = new FormControl('', Validators.required);
  usinaFilter = new FormControl('');
  usinaKeyword = '';
  usinaKeywordName = '';
  filteredUsinas: Observable<string[]> = of([]);
  isSubmitting: boolean = false; 

  tiposContratacao: string[] = [
    'AUMENTO DE QUADRO',
    'REPOSIÇÃO'
  ]

  niveisCargos: string[] = [
    'ADMINISTRATIVO',
    'SEGURANÇA DO TRABALHO'
  ]

  niveisCargosUsinas: string[] = [
    'OPERAÇÃO',
    'VENDAS',
    'TECNOLOGIA / LABORATÓRIO',
    'LIDERANÇA'
  ]


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private toastr: ToastrService,
    private fb: FormBuilder,
  ) {

  }

  ngOnInit(): void {
    this.buscarDadosDoUsuario();    
    this.getSolicitacoes();
    this.definirIntervaloPadrao();
    // this.filtrarSolicitacoes();
    this.carregarUsinasUnicas();
    this.carregarTiposVagaUnicos();
    // this.filtrarPorStatus('TODOS');

    this.colaboradorForm = this.fb.group({
              nomeColaborador: ['', Validators.required],
              cpfColaborador: ['', Validators.required],
              emailColaborador: ['', Validators.required],
              dataInicioPrevista: ['', Validators.required],
              tamanhoUniforme: ['', Validators.required],
              tamanhoCalca: ['', Validators.required],
              tamanhoBotina: ['', Validators.required],
              observacaoContratacao:['', Validators.required],
              status: ['FINALIZADO', Validators.required]
              });
    this.editForm = this.fb.group({
              solicitante: ['', Validators.required],
              tipoContratacao: ['', Validators.required],
              cargo: ['', Validators.required],
              usina: ['', Validators.required],
              setor: ['', Validators.required],
              nivel: ['', Validators.required],
              observacao: ['', Validators.required]
              });

              this.dataService.getUsinas().subscribe(data => {
                console.log(data)
                this.usinasDisponiveis = data.map((usina: any) => usina.nome_usina);
                console.log(this.usinasDisponiveis)
            
          },
        );
      
          // this.filteredUsinas = this.usinaControl.valueChanges.pipe(
          //       startWith(''),
          //       map(value => this._filterUsinas(value || '')
          //     ));
  }

  

  carregarTiposVagaUnicos(): void {
    const tipos = [...new Set(this.solicitacoesRh.map(s => s.tipoContratacao))];
    this.tiposVagaUnicos = ['TODOS', ...tipos];
  }

  definirIntervaloPadrao(): void {
    const hoje = moment();
    const trintaDiasAtras = moment().subtract(30, 'days');
    this.dateRange.start = trintaDiasAtras.toDate();
    this.dateRange.end = hoje.toDate();
  }

  carregarUsinasUnicas(): void {
    const usinas = [...new Set(this.solicitacoesRh.map(s => s.usina))];
    this.usinasUnicas = ['TODAS', ...usinas];
  }

  getSolicitacoes() {

    if(this.permissionUserCode !== "1" && this.permissionUserCode !== "2.4") {
      let params: any[] = []
      if (this.permissionUserCode === "2.1") {
        params = [
        'ADMINISTRATIVO', 'VENDAS', 'SEGURANÇA DO TRABALHO', 'ADMINISTRATIVO', 'TECNOLOGIA / LABORATÓRIO', 'LIDERANÇA'
      ]
      } else if (this.permissionUserCode === "2.5" || this.permissionUserCode === "2.6") {
        params = [
        'ADMINISTRATIVO', 'VENDAS', 'SEGURANÇA DO TRABALHO', 'ADMINISTRATIVO', 'TECNOLOGIA / LABORATÓRIO', 'LIDERANÇA', 'OPERAÇÃO'
      ]
      } else if(this.permissionUserCode === "2.7") {
        params = [
        'VENDAS', 'TECNOLOGIA / LABORATÓRIO', 'LIDERANÇA', 'OPERAÇÃO'
      ]
      }
      this.dataService.getSolicitacoesRhMatriz(params).subscribe(data => {
      this.isLoading = false;
      console.log(data)
      this.solicitacoesRh = data
      this.solicitacoesFiltradas = data
      console.log(this.solicitacoesRh)
      
    });   
    } else {
      this.dataService.getSolicitacoesRh().subscribe(data => {
      this.isLoading = false;
      console.log(data)
      this.solicitacoesRh = data
      this.solicitacoesFiltradas = data
      console.log(this.solicitacoesRh)
      
    }); 
    }
    
  }

  filtrarSolicitacoes(): void {
    let resultadosFiltrados = [...this.solicitacoesRh];

    // Filtrar por status
    if (this.filtroStatusSelecionado !== 'TODOS' && this.filtroStatusSelecionado !== null) {
      resultadosFiltrados = resultadosFiltrados.filter(solicitacao => solicitacao.status === this.filtroStatusSelecionado);
    }

    // Filtrar por usina
    const usinaSelecionada = this.filtroUsinaControl.value;
    if (usinaSelecionada !== 'TODAS' && usinaSelecionada !== null) {
      resultadosFiltrados = resultadosFiltrados.filter(solicitacao => solicitacao.usina === usinaSelecionada);
    }

    // Filtrar por tipo de vaga
    const tipoVagaSelecionado = this.filtroTipoVagaControl.value;
    if (tipoVagaSelecionado !== 'TODOS' && tipoVagaSelecionado !== null) {
      resultadosFiltrados = resultadosFiltrados.filter(solicitacao => solicitacao.tipoContratacao === tipoVagaSelecionado);
    }

    // Filtrar por intervalo de datas
    const dataInicio = this.dateRange.start;
    const dataFim = this.dateRange.end;

    if (dataInicio && dataFim) {
      resultadosFiltrados = resultadosFiltrados.filter(solicitacao => {
        const dataCriacao = moment(solicitacao.created_at).startOf('day');
        const inicioFiltrado = moment(dataInicio).startOf('day');
        const fimFiltrado = moment(dataFim).endOf('day');
        return dataCriacao.isSameOrAfter(inicioFiltrado) && dataCriacao.isSameOrBefore(fimFiltrado);
      });
    } else if (dataInicio) {
      resultadosFiltrados = resultadosFiltrados.filter(solicitacao =>
        moment(solicitacao.created_at).startOf('day').isSameOrAfter(moment(dataInicio).startOf('day'))
      );
    } else if (dataFim) {
      resultadosFiltrados = resultadosFiltrados.filter(solicitacao =>
        moment(solicitacao.created_at).startOf('day').isSameOrBefore(moment(dataFim).endOf('day'))
      );
    }
    this.carregarUsinasUnicas();
    this.carregarTiposVagaUnicos();
    this.solicitacoesFiltradas = resultadosFiltrados;
  }

  filtrarPorStatus(status: string | null): void {
    this.filtroStatusSelecionado = status;
    this.filtrarSolicitacoes(); // Refaz a filtragem combinada
  }

  limparFiltroStatus(): void {
    this.filtroStatusSelecionado = 'TODOS';
    this.filtroUsinaControl.setValue('TODAS');
    this.filtroTipoVagaControl.setValue('TODOS'); // Limpar o filtro de tipo de vaga
    this.definirIntervaloPadrao()
    this.filtrarSolicitacoes();
  }

  chamadaTeste(): void {
      this.filtrarSolicitacoes(); // Chamar a filtragem quando a data final mudar
    }

    filtrarPorTipoVaga(): void {
    this.filtrarSolicitacoes();
  }

  alterarPreparacao(object: any, element: any, status: any) {
    
    switch (element) {
  case 'statusSolicitacaoSt':
      
    let payloadSt = {
      statusSolicitacaoSt: status
    }
    this.dataService.updateSolicitacaoRh(object.id, payloadSt).subscribe(data => {
    this.isLoading = false;
    this.getSolicitacoes();
    this.filtrarSolicitacoes();
    
    
  });
    break; 
  case 'statusSolicitacaoDp':
    let payloadDp = {
      statusSolicitacaoDp: status
    }
    console.log(payloadDp, )
    this.dataService.updateSolicitacaoRh(object.id, payloadDp).subscribe(data => {
    this.isLoading = false;
    this.getSolicitacoes();
    this.filtrarSolicitacoes();
    
    
    
  });
    break;
  case 'statusSolicitacaoSuporte':
let payloadSuporte = {
      statusSolicitacaoSuporte: status
    }
    this.dataService.updateSolicitacaoRh(object.id, payloadSuporte).subscribe(data => {
    this.isLoading = false;
    this.getSolicitacoes();
    this.filtrarSolicitacoes();
    
    
  });
    break;
  case 'statusSolicitacaoSuprimentos':
let payloadSuprimentos = {
      statusSolicitacaoSuprimentos: status
    }
    this.dataService.updateSolicitacaoRh(object.id, payloadSuprimentos).subscribe(data => {
    this.isLoading = false;
    this.getSolicitacoes();
    this.filtrarSolicitacoes();
    
    
  });
    break;
  default:
    // Opcional: para lidar com qualquer outro valor de 'element' que não corresponda aos casos acima
    // console.warn('Tipo de solicitação desconhecido:', element);
    break;
}

    if (status === 1) {
      // aqui vamos iniciar preparacao de solicitacao
      this.toastr.success('Solicitação em preparação')

    } else if(status === 2) {
      //aqui vamos finalizar a solicitacao
      this.toastr.success('Solicitação finalizada')
    }

    // window.location.reload();
  }

aprovarSolicitacao(element: any, aprovacao: any) {
  let aprovado: number;
  let status: string;
  let obsNegado: string;
  let payload: { aprovado: number; status: string, observacaoNegado: string };

  if (aprovacao === 1) {
    aprovado = 1;
    status = "APROVADO";
    obsNegado = this.observacaoNegada;    

  } else {
    aprovado = 0;
    status = "NEGADO";
    obsNegado = this.observacaoNegada;
  }

  payload = {
    aprovado: aprovado,
    status: status,
    observacaoNegado: obsNegado
  };

  this.dataService.updateSolicitacaoRh(element.id, payload).subscribe(data => {
    this.isLoading = false;
    if (aprovacao === 1) {
        this.toastr.success("Solicitação aprovada com sucesso")
        this.enviarEmail(element);
    } else { 
        this.toastr.success("Solicitação negada com sucesso")
    }

    this.getSolicitacoes();
    this.filtrarSolicitacoes();
    this.observacaoNegada = ''
    this.closeModal('card-modal-delete')
    window.location.reload();
    
  });
}

  negarSolicitacao(element: any) {
    this.openModal('card-modal-delete')
    this.elementNegado = element;

    }

    openModal(id: any) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.style.display = 'block';
    }
  }

  closeModal(id: any) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.style.display = 'none';
    }
  }

  goToAdd() {
    this.router.navigate(['app/rh/addVagas']);
  }

// enviarEmail(vaga: any) {
//   const destinatariosEmail: { [nivel: string]: string[] } = {
//     'ADMINISTRATIVO': ['dp@concrelagos.com', 'suporte@concrelagos.com', 'segurançadotrabalho@concrelagos.com'],
//     'SEGURANÇA DO TRABALHO': ['dp@concrelagos.com', 'suporte@concrelagos.com', 'segurançadotrabalho@concrelagos.com', 'suporte_celular@concrelagos.com'],
//     'OPERAÇÃO': ['dp@concrelagos.com', 'segurançadotrabalho@concrelagos.com'],
//     'VENDAS': ['dp@concrelagos.com', 'segurançadotrabalho@concrelagos.com', 'suporte_celular@concrelagos.com', 'suprimentos@concrelagos.com'],
//     'DEFAULT': ['dp@concrelagos.com', 'suporte@concrelagos.com', 'segurançadotrabalho@concrelagos.com', 'suporte_celular@concrelagos.com', 'suprimentos@concrelagos.com']
//   };

//   const nivel = vaga.nivel?.toUpperCase();
//   const emails = destinatariosEmail[nivel] || destinatariosEmail['DEFAULT'];

//   if (emails) {
//     const listaEmails = emails.join(', ');
//     alert(listaEmails);
//   } else {
//     console.warn(`Nível "${vaga.nivel}" não encontrado para envio de e-mail.`);
//     alert('Não foi possível determinar os destinatários de e-mail para este nível.');
//   }
// }


enviarEmail(vaga: any) {
    let destinatarios: any[] = [];
    let destinatarioColaborador: any = { email: this.colaboradorForm.value.email, name:"TESTE" }
    let corpoEmail: string = '';
    // let corpoEmailColaborador: string = '';
    if (vaga.status === 'PENDENTE') {
      corpoEmail = `
      <html>
        <head>
          <title>Nova Solicitação de Vaga</title>
        </head>
        <body>
          <p>Prezados,</p>
          <p>Uma nova solicitação de vaga foi criada com os seguintes detalhes:</p>
          <ul>
            <li><strong>Nível:</strong> ${vaga.nivel}</li>
            <li><strong>Solicitante:</strong> ${vaga.solicitante}</li>
            <li><strong>Cargo:</strong> ${vaga.cargo}</li>
            <li><strong>Tipo de Contratação:</strong> ${vaga.tipoContratacao}</li>
            <li><strong>Usina:</strong> ${vaga.usina?.nome || vaga.usina}</li>
            <li><strong>Setor:</strong> ${vaga.setor}</li>
            <li><strong>Observação:</strong> ${vaga.observacao || 'Nenhuma'}</li>
          </ul>
          <p>Por favor, confiram mais informações sobre a solicitação no sistema Concrelagos Master.</p>
          <!-- Espaço para digitar texto -->
<br>
<br>
<h3 color="#000000" class="nomeempresa" style="margin: 0px; font-size: 15px; color: rgb(0, 0, 0); text-align:left; min-width:250px">
							<span>
								Atenciosamente;
							</span>
<br>
<br>
<!-- Inicio do codigo -->
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <!-- <meta name="color-scheme" content="light dark"> -->
    <!-- <meta name="supported-color-schemes" content="light dark"> -->
    <!-- <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,700;1,500&display=swap" rel="stylesheet"> -->

<table cellpadding="0" cellspacing="0" class="17" style="vertical-align: -webkit-baseline-middle; font-size: large; font-family: Arial;">

	<tbody> <!-- corpo assinatura -->

		<tr> <!-- linha -->
		<td> <!-- célula -->
		<table cellpadding="0" cellspacing="0" class="1" style="vertical-align: -webkit-baseline-middle; font-size: large; font-family: Arial;"> <!-- tabela -->
			<tbody>
				<tr>
					<!-- Bloco 1 Esquerda -->
					<td style="vertical-align: middle;">
						<h3 color="#000000" class="nomeempresa" style="margin: 0px; font-size: 20px; color: rgb(0, 0, 0); text-align:left; min-width:250px">
							<span>
								Setor de R.H.
							</span>
							<span>
								&nbsp; <!-- espaço sem quebra de linha -->
							</span>
							<span>
							</span>
						</h3>

						<p color="#000000" font-size="large" class="nomefilial"  style="margin: 0px; color: rgb(0, 0, 0); font-size: 16px; line-height: 24px ; text-align:left; ">
							<span>
								Recursos Humanos
							</span>
						</p> <!--
						<p color="#000000" font-size="large" class="nomefilial" style="margin: 0px; color: rgb(0, 0, 0); font-size: 12px; line-height: 24px ; text-align:left;">
							<span>

							</span>
						</p> -->
					</td>
					<!-- FIM Bloco 1 Esquerda -->


					<!-- espaçamento entre bloco 1 e linha do meio-->
					<td width="50">
						<div style="width: 15px;"> </div>
					</td>

					<!-- linha divisória entre bloco 1 e 2 esquerda /direita -->
					<td color="#b17c18" direction="vertical" width="50" class="divisoriablocos1e2" style="width: 1px; border-bottom: none; border-left: 1px solid rgb(177, 124, 24);">
					</td>

					<!-- espaçamento entre bloco 2 e linha do meio-->
					<td width="15">
						<div style="width: 15px;"></div>
					</td>

					<!-- Bloco 2 da direita -->
					<td style="vertical-align: middle;">
						<table cellpadding="1" cellspacing="0" class="2" style="vertical-align: -webkit-baseline-middle; font-size: large; font-family: Arial; min-width:250px">
							<tbody>
								<tr height="25" style="vertical-align: middle;">
									<td width="3" style="vertical-align: middle;">
										<table cellpadding="1" cellspacing="0" class="18" style="vertical-align: -webkit-baseline-middle; font-size: large; font-family: Arial;">
										<tbody>
											<tr>
												<td style="vertical-align: bottom;">
													<!-- ícone telefone -->
													<span color="#b17c18" width="11" class="19" style="display: block; <background-color: rgb(177, 124, 24);">
														<img src="https://concrelagos.com/marketing/icotel.png" width="13" height = "13" class="sc-iRbamj blSEcj" style="display: block;">
													</span>
												</td>
											</tr>
										</tbody>
										</table>
									</td>
									<!-- Texto Telefone -->
									<td style="padding: 0px; color: rgb(0, 0, 0);">
										<a href="https://api.whatsapp.com/send?phone=5522981791717" color="#000000" class="20" style="text-decoration: none; color: rgb(0, 0, 0); font-size: 12px;">
											<span>0800 033 1001</span>
										</a>
										<a href="tel:022998148679" color="#000000" class="21" style="text-decoration: none; color: rgb(0, 0, 0); font-size: 12px;">
											<span> | 22 99814 8679</span>
									</td>
								</tr>

								<tr height="25" style="vertical-align: middle;">
									<td width="30" style="vertical-align: middle;">
										<table cellpadding="1" cellspacing="0" class="3" style="vertical-align: -webkit-baseline-middle; font-size: large; font-family: Arial;">
											<tbody>
												<tr>
													<td style="vertical-align: bottom;">
														<!-- ícone Email -->
														<span color="#b17c18" width="11" class="22" style="display: block;">
															<img src="https://concrelagos.com/marketing/icoarroba.png" color="#b17c18" width="13" height = "13" class="23" style="display: block;">
														</span>
													</td>
												</tr>
											</tbody>
										</table>
									</td>
									<!-- Texto Email -->
									<td style="padding: 0px;">
										<a href="mailto:rh@concrelagos.com" color="#000000" class="4" style="text-decoration: none; color: rgb(0, 0, 0); font-size: 12px;">
											<span>rh@concrelagos.com</span>
										</a>
									</td>
								</tr>

								<tr height="25" style="vertical-align: middle;">
									<td width="30" style="vertical-align: middle;">
										<table cellpadding="1" cellspacing="0" class="5" style="vertical-align: -webkit-baseline-middle; font-size: large; font-family: Arial;">
											<tbody>
												<tr>
													<td style="vertical-align: bottom;">
														<!-- ícone Site -->
														<span color="#b17c18" width="11" class="sc-jlyJG bbyJzT" style="display: block;">
															<img src="https://concrelagos.com/marketing/icosite.png" color="#b17c18" width="13" height = "13" class="24" style="display: block;">
														</span>

													</td>
												</tr>
											</tbody>
										</table>
									</td>

									<!-- Texto Site -->
									<td style="padding: 0px;">
										<a href="https://www.concrelagos.com.br/?utm_source=email&utm_campaign=assinatura" color="#000000" class="6" style="text-decoration: none; color: rgb(0, 0, 0); font-size: 12px;">
											<span>www.concrelagos.com.br</span>
										</a>
									</td>
								</tr>
								<tr height="25" style="vertical-align: middle;">
									<!-- Texto Endereço -->
									<td width="30" style="vertical-align: middle;">
										<table cellpadding="1" cellspacing="0" class="7" style="vertical-align: -webkit-baseline-middle; font-size: large; font-family: Arial;">
											<tbody>
												<tr>
													<td style="vertical-align: bottom;">
														<!-- ícone Endereço -->
														<span color="#b17c18" width="11" class="25" style="display: block;">
															<img src="https://concrelagos.com/marketing/icolocal.png" color="#b17c18" width="13" height="13" class="26" style="display: block;">
														</span>
													</td>
												</tr>
											</tbody>
										</table>
									</td><td style="padding: 0px;"><span color="#000000" class="8" style="font-size: 12px; color: rgb(0, 0, 0);"><span>R. Barão do Monte Alto, 111 </span><br><spam>Pres. Costa e Silva </spam><br><spam>Itaperuna - RJ</spam></span></td></tr>
							</tbody>
						</table>
					</td>
					<!-- FIM Bloco 2 da direita -->
				</tr></tbody>

		</table>
		</td>
		</tr>

		<tr>
		<td>
		<table cellpadding="3" cellspacing="0" class="9" style="vertical-align: -webkit-baseline-middle; font-size: large; font-family: Arial; width: 100%;">
			<tbody>
				<tr>
					<!-- espaçamento entre parte superior e linha horizontal
					<td height="10">
					</td>  -->
				</tr>
				<tr>
					<!-- linha divisória horizontal -->
					<td color="#b17c18" direction="horizontal" height="0" class="10" style="width: 100%; border-bottom: 1px solid rgb(177, 124, 24); border-left: none; display: block;">
					</td>
				</tr>
				<tr>
					<!-- espaçamento entre linha horizontal e ícones rodape
					<td height="10">
					</td> -->
				</tr>
			</tbody>
		</table>
		</td>
		</tr>

		<tr>
		<td>
		<table cellpadding="10" cellspacing="0" class="11" style="vertical-align: -webkit-baseline-middle; font-size: large; font-family: Arial; width: 100%;min-height:1000px;">
			<tbody>
				<tr>
				<td style="vertical-align: top;">
					<img src="https://concrelagos.com/marketing/logo.png" role="presentation" width="170" class="27" style="max-width: 170px; display: inline-block;">
				</td>
				<td style="text-align: right; vertical-align: top;">
					<table cellpadding="0" cellspacing="0" class="16" style="vertical-align: -webkit-baseline-middle; font-size: large; font-family: Arial; display: inline-block;">
						<tbody>
							<tr style="text-align: right;">
								<td>
									<a href="https://www.facebook.com/concrelagos.oficial" color="#687380" class="12" style="display: inline-block; padding: 0px;">
										<img src="https://concrelagos.com/marketing/icoface.png" alt="facebook" color="#687380" width= "24" height="24" class="16" style="max-width: 135px; display: block;">
									</a>
								</td>
								<td width="5">
									<div></div>
								</td>
								<td>
									<a href="https://www.instagram.com/concrelagos_oficial/" color="#687380" class="13" style="display: inline-block; padding: 0px; ">
										<img src="https://concrelagos.com/marketing/icoinsta.png" alt="instagram" color="#687380" width="24"  height="24" class="16" style=" max-width: 135px; display: block;">
									</a>
								</td>
								<td width="5">
								<div></div>
								</td>
							</tr>
						</tbody>
					</table>
				</td>
				</tr>
			</tbody>
		</table>
		</td>
		</tr>
		<tr>
		<td height="30">
		</td>
		</tr>
</tbody>
</table>

        </body>
      </html>
    `;
    } else if (vaga.status === 'APROVADO') {
      corpoEmail = `
      <html>
        <head>
          <title>Vaga finalizada</title>
        </head>
        <body>
          <p>Prezados,</p>
          <p>Uma nova solicitação de vaga foi finalizada e já temos os dados do novo colaborador:</p>
          <ul>
            <li><strong>Nome:</strong> ${this.colaboradorForm.value.nomeColaborador}</li>
            <li><strong>E-mail:</strong> ${this.colaboradorForm.value.emailColaborador}</li>
            <li><strong>Cargo:</strong> ${vaga.cargo}</li>
            <li><strong>CPF:</strong> ${this.colaboradorForm.value.cpfColaborador}</li>
            <li><strong>Usina:</strong> ${vaga.usina?.nome || vaga.usina}</li>
            <li><strong>Setor:</strong> ${vaga.setor}</li>
            <li><strong>Data de início prevista:</strong> ${this.colaboradorForm.value.dataInicioPrevista || 'Nenhuma'}</li>
          </ul>
          <p>Por favor, confiram mais informações sobre a solicitação no sistema Concrelagos Master.</p>
          <!-- Espaço para digitar texto -->
<br>
<br>
<h3 color="#000000" class="nomeempresa" style="margin: 0px; font-size: 15px; color: rgb(0, 0, 0); text-align:left; min-width:250px">
							<span>
								Atenciosamente;
							</span>
<br>
<br>
<!-- Inicio do codigo -->
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <!-- <meta name="color-scheme" content="light dark"> -->
    <!-- <meta name="supported-color-schemes" content="light dark"> -->
    <!-- <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,700;1,500&display=swap" rel="stylesheet"> -->

<table cellpadding="0" cellspacing="0" class="17" style="vertical-align: -webkit-baseline-middle; font-size: large; font-family: Arial;">

	<tbody> <!-- corpo assinatura -->

		<tr> <!-- linha -->
		<td> <!-- célula -->
		<table cellpadding="0" cellspacing="0" class="1" style="vertical-align: -webkit-baseline-middle; font-size: large; font-family: Arial;"> <!-- tabela -->
			<tbody>
				<tr>
					<!-- Bloco 1 Esquerda -->
					<td style="vertical-align: middle;">
						<h3 color="#000000" class="nomeempresa" style="margin: 0px; font-size: 20px; color: rgb(0, 0, 0); text-align:left; min-width:250px">
							<span>
								Setor de R.H.
							</span>
							<span>
								&nbsp; <!-- espaço sem quebra de linha -->
							</span>
							<span>
							</span>
						</h3>

						<p color="#000000" font-size="large" class="nomefilial"  style="margin: 0px; color: rgb(0, 0, 0); font-size: 16px; line-height: 24px ; text-align:left; ">
							<span>
								Recursos Humanos
							</span>
						</p> <!--
						<p color="#000000" font-size="large" class="nomefilial" style="margin: 0px; color: rgb(0, 0, 0); font-size: 12px; line-height: 24px ; text-align:left;">
							<span>

							</span>
						</p> -->
					</td>
					<!-- FIM Bloco 1 Esquerda -->


					<!-- espaçamento entre bloco 1 e linha do meio-->
					<td width="50">
						<div style="width: 15px;"> </div>
					</td>

					<!-- linha divisória entre bloco 1 e 2 esquerda /direita -->
					<td color="#b17c18" direction="vertical" width="50" class="divisoriablocos1e2" style="width: 1px; border-bottom: none; border-left: 1px solid rgb(177, 124, 24);">
					</td>

					<!-- espaçamento entre bloco 2 e linha do meio-->
					<td width="15">
						<div style="width: 15px;"></div>
					</td>

					<!-- Bloco 2 da direita -->
					<td style="vertical-align: middle;">
						<table cellpadding="1" cellspacing="0" class="2" style="vertical-align: -webkit-baseline-middle; font-size: large; font-family: Arial; min-width:250px">
							<tbody>
								<tr height="25" style="vertical-align: middle;">
									<td width="3" style="vertical-align: middle;">
										<table cellpadding="1" cellspacing="0" class="18" style="vertical-align: -webkit-baseline-middle; font-size: large; font-family: Arial;">
										<tbody>
											<tr>
												<td style="vertical-align: bottom;">
													<!-- ícone telefone -->
													<span color="#b17c18" width="11" class="19" style="display: block; <background-color: rgb(177, 124, 24);">
														<img src="https://concrelagos.com/marketing/icotel.png" width="13" height = "13" class="sc-iRbamj blSEcj" style="display: block;">
													</span>
												</td>
											</tr>
										</tbody>
										</table>
									</td>
									<!-- Texto Telefone -->
									<td style="padding: 0px; color: rgb(0, 0, 0);">
										<a href="https://api.whatsapp.com/send?phone=5522981791717" color="#000000" class="20" style="text-decoration: none; color: rgb(0, 0, 0); font-size: 12px;">
											<span>0800 033 1001</span>
										</a>
										<a href="tel:022998148679" color="#000000" class="21" style="text-decoration: none; color: rgb(0, 0, 0); font-size: 12px;">
											<span> | 22 99814 8679</span>
									</td>
								</tr>

								<tr height="25" style="vertical-align: middle;">
									<td width="30" style="vertical-align: middle;">
										<table cellpadding="1" cellspacing="0" class="3" style="vertical-align: -webkit-baseline-middle; font-size: large; font-family: Arial;">
											<tbody>
												<tr>
													<td style="vertical-align: bottom;">
														<!-- ícone Email -->
														<span color="#b17c18" width="11" class="22" style="display: block;">
															<img src="https://concrelagos.com/marketing/icoarroba.png" color="#b17c18" width="13" height = "13" class="23" style="display: block;">
														</span>
													</td>
												</tr>
											</tbody>
										</table>
									</td>
									<!-- Texto Email -->
									<td style="padding: 0px;">
										<a href="mailto:rh@concrelagos.com" color="#000000" class="4" style="text-decoration: none; color: rgb(0, 0, 0); font-size: 12px;">
											<span>rh@concrelagos.com</span>
										</a>
									</td>
								</tr>

								<tr height="25" style="vertical-align: middle;">
									<td width="30" style="vertical-align: middle;">
										<table cellpadding="1" cellspacing="0" class="5" style="vertical-align: -webkit-baseline-middle; font-size: large; font-family: Arial;">
											<tbody>
												<tr>
													<td style="vertical-align: bottom;">
														<!-- ícone Site -->
														<span color="#b17c18" width="11" class="sc-jlyJG bbyJzT" style="display: block;">
															<img src="https://concrelagos.com/marketing/icosite.png" color="#b17c18" width="13" height = "13" class="24" style="display: block;">
														</span>

													</td>
												</tr>
											</tbody>
										</table>
									</td>

									<!-- Texto Site -->
									<td style="padding: 0px;">
										<a href="https://www.concrelagos.com.br/?utm_source=email&utm_campaign=assinatura" color="#000000" class="6" style="text-decoration: none; color: rgb(0, 0, 0); font-size: 12px;">
											<span>www.concrelagos.com.br</span>
										</a>
									</td>
								</tr>
								<tr height="25" style="vertical-align: middle;">
									<!-- Texto Endereço -->
									<td width="30" style="vertical-align: middle;">
										<table cellpadding="1" cellspacing="0" class="7" style="vertical-align: -webkit-baseline-middle; font-size: large; font-family: Arial;">
											<tbody>
												<tr>
													<td style="vertical-align: bottom;">
														<!-- ícone Endereço -->
														<span color="#b17c18" width="11" class="25" style="display: block;">
															<img src="https://concrelagos.com/marketing/icolocal.png" color="#b17c18" width="13" height="13" class="26" style="display: block;">
														</span>
													</td>
												</tr>
											</tbody>
										</table>
									</td><td style="padding: 0px;"><span color="#000000" class="8" style="font-size: 12px; color: rgb(0, 0, 0);"><span>R. Barão do Monte Alto, 111 </span><br><spam>Pres. Costa e Silva </spam><br><spam>Itaperuna - RJ</spam></span></td></tr>
							</tbody>
						</table>
					</td>
					<!-- FIM Bloco 2 da direita -->
				</tr></tbody>

		</table>
		</td>
		</tr>

		<tr>
		<td>
		<table cellpadding="3" cellspacing="0" class="9" style="vertical-align: -webkit-baseline-middle; font-size: large; font-family: Arial; width: 100%;">
			<tbody>
				<tr>
					<!-- espaçamento entre parte superior e linha horizontal
					<td height="10">
					</td>  -->
				</tr>
				<tr>
					<!-- linha divisória horizontal -->
					<td color="#b17c18" direction="horizontal" height="0" class="10" style="width: 100%; border-bottom: 1px solid rgb(177, 124, 24); border-left: none; display: block;">
					</td>
				</tr>
				<tr>
					<!-- espaçamento entre linha horizontal e ícones rodape
					<td height="10">
					</td> -->
				</tr>
			</tbody>
		</table>
		</td>
		</tr>

		<tr>
		<td>
		<table cellpadding="10" cellspacing="0" class="11" style="vertical-align: -webkit-baseline-middle; font-size: large; font-family: Arial; width: 100%;min-height:1000px;">
			<tbody>
				<tr>
				<td style="vertical-align: top;">
					<img src="https://concrelagos.com/marketing/logo.png" role="presentation" width="170" class="27" style="max-width: 170px; display: inline-block;">
				</td>
				<td style="text-align: right; vertical-align: top;">
					<table cellpadding="0" cellspacing="0" class="16" style="vertical-align: -webkit-baseline-middle; font-size: large; font-family: Arial; display: inline-block;">
						<tbody>
							<tr style="text-align: right;">
								<td>
									<a href="https://www.facebook.com/concrelagos.oficial" color="#687380" class="12" style="display: inline-block; padding: 0px;">
										<img src="https://concrelagos.com/marketing/icoface.png" alt="facebook" color="#687380" width= "24" height="24" class="16" style="max-width: 135px; display: block;">
									</a>
								</td>
								<td width="5">
									<div></div>
								</td>
								<td>
									<a href="https://www.instagram.com/concrelagos_oficial/" color="#687380" class="13" style="display: inline-block; padding: 0px; ">
										<img src="https://concrelagos.com/marketing/icoinsta.png" alt="instagram" color="#687380" width="24"  height="24" class="16" style=" max-width: 135px; display: block;">
									</a>
								</td>
								<td width="5">
								<div></div>
								</td>
							</tr>
						</tbody>
					</table>
				</td>
				</tr>
			</tbody>
		</table>
		</td>
		</tr>
		<tr>
		<td height="30">
		</td>
		</tr>
</tbody>
</table>

        </body>
      </html>
    `;
    // corpoEmailColaborador = `
    //   <!DOCTYPE html>
    //   <html>
    //   <head>
    //   <meta charset="UTF-8">
    //   <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //   <title>Bem-vindo(a) à Família Concrelagos Concreto!</title>
    //   <style>
    //     body {
    //       font-family: Arial, sans-serif;
    //       line-height: 1.6;
    //       color: #333;
    //       background-color: #f4f4f4;
    //       margin: 0;
    //       padding: 0;
    //     }
    //     .container {
    //       max-width: 600px;
    //       margin: 20px auto;
    //       background-color: #fff;
    //       padding: 30px;
    //       border-radius: 8px;
    //       box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    //     }
    //     .header {
    //       text-align: center;
    //       padding-bottom: 20px;
    //       border-bottom: 1px solid #eee;
    //     }
    //     .header img {
    //       max-width: 180px; /* Ajuste o tamanho do logo conforme necessário */
    //       height: auto;
    //       margin-bottom: 15px;
    //     }
    //     .header h1 {
    //       color: #004d40; /* Verde escuro, ajuste para a cor da sua marca */
    //       margin: 0;
    //       font-size: 28px;
    //     }
    //     .content {
    //       padding-top: 20px;
    //     }
    //     .content h2 {
    //       color: #004d40;
    //       font-size: 22px;
    //       margin-top: 0;
    //     }
    //     .content p {
    //       margin-bottom: 15px;
    //     }
    //     .highlight {
    //       color: #00796b; /* Verde um pouco mais claro */
    //       font-weight: bold;
    //     }
    //     .list-items {
    //       list-style: none;
    //       padding: 0;
    //     }
    //     .list-items li {
    //       background-color: #e0f2f1; /* Fundo verde claro para os itens */
    //       margin-bottom: 8px;
    //       padding: 10px 15px;
    //       border-radius: 5px;
    //     }
    //     .footer {
    //       text-align: center;
    //       padding-top: 20px;
    //       margin-top: 30px;
    //       border-top: 1px solid #eee;
    //       font-size: 14px;
    //       color: #777;
    //     }
    //     .footer a {
    //       color: #004d40;
    //       text-decoration: none;
    //     }
    //   </style>
    //   </head>
    //   <body>
    //     <div class="container">
    //       <div class="header">
    //         <img src="URL_DO_SEU_LOGO_CONCRELAGOS.png" alt="Logo Concrelagos Concreto">
    //         <h1>Bem-vindo(a) à Família Concrelagos Concreto!</h1>
    //       </div>
    //       <div class="content">
    //         <p>Prezado(a) <span class="highlight">${this.colaboradorForm.value.nomeColaborador}</span>,</p>
    //         <p>É com grande alegria que a Concrelagos Concreto lhe dá as boas-vindas à nossa equipe!</p>
    //         <p>Estamos muito entusiasmados em tê-lo(a) conosco e acreditamos que sua experiência e talento serão um grande diferencial para o nosso crescimento e sucesso. Sua jornada aqui na Concrelagos Concreto começa em um momento de muitas oportunidades e aprendizado.</p>

    //         <p>Seu primeiro dia de trabalho será em <span class="highlight">${this.colaboradorForm.value.dataInicioPrevista || 'Nenhuma'}</span>. Estamos ansiosos para recebê-lo(a) e apresentá-lo(a) aos seus novos colegas e ao seu ambiente de trabalho.</p>

    //         <p>Para facilitar sua integração, preparamos algumas informações importantes para seus primeiros dias:</p>
    //         <ul class="list-items">
    //           <li><strong>Local de Trabalho:</strong> ${vaga.usina?.nome || vaga.usina}</li>
    //           <li><strong>Cargo:</strong> ${vaga.cargo}</li>
    //           <li><strong>Setor:</strong> ${vaga.setor}</li>
    //           <li><strong>Horário:</strong> [Horário de Início e Fim do Expediente - *Ajustar manualmente ou via variável, se houver*]</li>
    //           <li><strong>Ponto de Encontro:</strong> Por favor, dirija-se à [Área/Recepção Específica - *Ajustar manualmente ou via variável, se houver*] ao chegar.</li>
    //           <li><strong>Pessoa de Contato:</strong> Em caso de dúvidas, procure por <span class="highlight">[Nome do Gestor/Padrinho de Integração - *Ajustar manualmente ou via variável, se houver*]</span>, que será seu ponto de apoio inicial.</li>
    //         </ul>

    //         <p>Durante sua primeira semana, você participará de nosso programa de integração, onde terá a oportunidade de conhecer mais sobre a Concrelagos Concreto, nossa cultura, valores e processos.</p>

    //         <p>Seja bem-vindo(a)! Contamos com você para construirmos juntos um futuro sólido!</p>

    //         <p>Atenciosamente,</p>
    //         <p>A Equipe de Recursos Humanos da Concrelagos Concreto</p>
    //       </div>
    //       <div class="footer">
    //         <p>Concrelagos Concreto | [Site da Empresa ou Redes Sociais - *Ajustar manualmente*]</p>
    //         <p>Endereço da Sede, Itaperuna - RJ, Brasil</p>
    //       </div>
    //     </div>
    //   </body>
    //   </html>
    // `;
    } else {
      alert('error')
    }
    

    const nivel: string = (vaga.nivel as string)?.toUpperCase(); // Garante que nivel seja string
    // Ou, com uma verificação extra para garantir que vaga.nivel não seja null/undefined antes da conversão:
    // const nivel: string = vaga.nivel ? (vaga.nivel as string).toUpperCase() : '';

    const destinatariosEmail: any = {
      'ADMINISTRATIVO': [
        { email: 'dp@concrelagos.com', name: "DP Concrelagos" },
        { email: 'suporte@concrelagos.com', name: "Suporte T.I" },
        { email: 'jaqueline.almeida@concrelagos.com', name: "ST Concrelagos" },
        { email: 'joao.victor.gomes@concrelagos.com', name: "ST Concrelagos" },
        { email: 'jr.andersonfs@gmail.com', name:"TESTE" }
      ],
      'SEGURANÇA DO TRABALHO': [
        { email: 'dp@concrelagos.com', name: "DP Concrelagos" },
        { email: 'suporte@concrelagos.com', name: "Suporte T.I" },
        { email: 'jaqueline.almeida@concrelagos.com', name: "ST Concrelagos" },
        { email: 'joao.victor.gomes@concrelagos.com', name: "ST Concrelagos" },
        { email: 'jr.andersonfs@gmail.com', name:"TESTE" }
      ],
      'OPERAÇÃO': [
        { email: 'dp@concrelagos.com', name: "DP Concrelagos" },
        { email: 'jaqueline.almeida@concrelagos.com', name: "ST Concrelagos" },
        { email: 'joao.victor.gomes@concrelagos.com', name: "ST Concrelagos" },
        { email: 'jr.andersonfs@gmail.com', name:"TESTE" }
      ],
      'VENDAS': [
        { email: 'dp@concrelagos.com', name: "DP Concrelagos" },
        { email: 'jaqueline.almeida@concrelagos.com', name: "ST Concrelagos" },
        { email: 'joao.victor.gomes@concrelagos.com', name: "ST Concrelagos" },
        { email: 'suporte@concrelagos.com', name: "Suporte T.I" },
        { email: 'suprimentos@concrelagos.com', name:"Suprimentos" },
        { email: 'jr.andersonfs@gmail.com', name:"Anderson" }
      ],
      'DEFAULT': [
        { email: 'dp@concrelagos.com', name: "DP Concrelagos" },
        { email: 'suporte@concrelagos.com', name: "Suporte T.I" },
        { email: 'jaqueline.almeida@concrelagos.com', name: "ST Concrelagos" },
        { email: 'joao.victor.gomes@concrelagos.com', name: "ST Concrelagos" },
        { email: 'suprimentos@concrelagos.com', name:"Suprimentos" },
        { email: 'jr.andersonfs@gmail.com', name:"TESTE" }
      ]
    };

    destinatarios = destinatariosEmail[nivel] || destinatariosEmail['DEFAULT'];


    const emailData = {
      subject: 'Nova Solicitação de Vaga',
      message: corpoEmail,
      destinatarios: destinatarios
    };

    // const emailDataColaborador = {
    //   subject: 'Seja bem-vindo(a)',
    //   message: corpoEmailColaborador,
    //   destinatarios: destinatarioColaborador
    // };

    console.log(emailData)

    this.dataService.sendEmail(emailData).subscribe(data => {
    this.isLoading = false;
    this.toastr.success('Os setores responsáveis já foram notificados!')    
  });
  // this.dataService.sendEmail(emailDataColaborador).subscribe(data => {
  //   this.isLoading = false;
  //   this.toastr.success('Colaborador notificado com sucesso')    
  // });
  }

  finalizarVaga(id: any, element: any) {
    this.idFinalizar = id;
    this.elementFinalizar = element
  }

  onSubmit() {
    console.log(this.colaboradorForm.value)
    const formValue = { ...this.colaboradorForm.value };
    console.log(formValue);
    formValue.dataInicioPrevista = this.formatarDataParaString(formValue.dataInicioPrevista);
    this.dataService.updateSolicitacaoRh(this.idFinalizar, formValue).subscribe(data => {
    this.isLoading = false;
    this.toastr.success('Vaga finalizada com sucesso');
    this.getSolicitacoes();
    this.filtrarSolicitacoes();
    this.enviarEmail(this.elementFinalizar);
    this.closeModal('card-modal-finalizar')
    // window.location.reload();
    
  });
    
    
  }

  buscarDadosDoUsuario() {
    const currentUserJson = sessionStorage.getItem('currentUser')
    if (currentUserJson) {
      const currentUser = JSON.parse(currentUserJson);
      this.userName = currentUser.username;
      this.permissionUser = currentUser.permission;
      this.permissionUserCode = currentUser.permission_code;
      console.log(this.permissionUserCode)
    }
  }

  getStatusText(statusCode: any): string {
    switch (statusCode) {
      case '0':
        return 'ABERTO';
      case '1':
        return 'EM ANDAMENTO';
      case '2':
        return 'CONCLUÍDO';
      default:
        return 'DESCONHECIDO'; // Para lidar com valores não esperados
    }
  }

  getStatusClass(statusCode: any): string {
    switch (statusCode) {
      case '0':
        return 'status-aberto';
      case '1':
        return 'status-em-andamento';
      case '2':
        return 'status-concluido';
      default:
        return 'status-desconhecido'; // Ou uma classe padrão
    }
  }

  // FUNÇÃO AUXILIAR PARA FORMATAR A DATA
  private formatarDataParaString(data: Date | null): string | null {
    if (!data) {
      return null;
    }

    // Obter dia, mês e ano
    const dia = data.getDate().toString().padStart(2, '0'); // Garante 2 dígitos (ex: 09)
    const mes = (data.getMonth() + 1).toString().padStart(2, '0'); // getMonth() é 0-indexed, então +1
    const ano = data.getFullYear();


    return `${dia}/${mes}/${ano}`;

    // return `${dia}-${mes}-${ano}`;
  }

  editarSolicitacao(element: any) {
    this.editForm = this.fb.group({
      solicitante: [element.solicitante, Validators.required],
      tipoContratacao: [element.tipoContratacao, Validators.required],
      cargo: [element.cargo, Validators.required],
      usina: [element.usina, Validators.required],
      setor: [element.setor, Validators.required],
      nivel: [element.nivel, Validators.required],
      observacao: [element.observacao, Validators.required]
      });
      this.idFinalizar = element.id
  }

  onSubmitEdit() {


    if (this.editForm.valid) {
          this.isSubmitting = true;
          const novoRegistro = this.editForm.value;
          console.log(novoRegistro)
          this.toastr.warning('Trabalhando na sua solicitação');
          this.dataService.updateSolicitacaoRh(this.idFinalizar ,novoRegistro).subscribe(
            response => {
              console.log('Solicitação inserida com sucesso:', response);
              this.toastr.success('Solicitação editada com sucesso');
              this.isSubmitting = false;
              this.getSolicitacoes();
            },
            error => {
              console.error('Erro ao editar solicitação:', error);
              this.toastr.error('Erro ao editar solicitação');
              this.isSubmitting = false;
            }
          );
        }
  }

  
  filterUsinas() {
    this.filteredUsinas = of(this._filterUsinas(this.usinaKeyword));
  }

    usinaOpcaoValidator(formGroup: FormGroup) {
        const usinaControl = formGroup.controls['usina'];
        const usinaValue = usinaControl.value;

        if (usinaValue && this.usinasDisponiveis.indexOf(usinaValue) === -1) {
          usinaControl.setErrors({ usinaInvalida: true });
        } else {
          // Limpa o erro caso a validação passe
          const errors = usinaControl.errors;
          if (errors && errors['usinaInvalida']) {
            delete errors['usinaInvalida'];
            if (Object.keys(errors).length === 0) {
              usinaControl.setErrors(null);
            }
          }
        }
      }

  private _filterUsinas(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.usinasDisponiveis.filter(option => option.toLowerCase().includes(filterValue));
  }

    optionSelectedUsina(event: any): void {
    this.usinaKeywordName = event.option.value; // Atualiza o valor do input com a usina selecionada
  }

    choseUsina(option: string) {
    this.usinaKeyword = option;
  }

    displayFnUsina(usina: string): string {
    return usina ? usina : '';
  }

    validacaoMatriz(option: string) {
    this.isMatriz = option === 'MATRIZ'; // Define isMatriz como true se "MATRIZ" for selecionada
  }

}