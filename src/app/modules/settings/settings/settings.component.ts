import { Casos, Usinas } from '@/src/app/interfaces/casos';
import { Usuario } from '@/src/app/interfaces/usuario';
import { DataService } from '@/src/app/services/data.service';
import { UsinasService } from '@/src/app/services/usinas.service';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  settings = [
    { name: 'Casos', type: 'casos-modal-delete', icon: "support_agent", modal: 'casos-modal' },
    { name: 'Usinas', type: 'usinas-delete-modal', icon: "factory", modal: 'usinas-modal' },
    { name: 'Categorias', type: 'categoria-delete-modal', icon: "computer", modal: 'categoria-modal' },
    { name: 'Usuários', type: 'users-ativacao-modal', icon: "person", modal: 'users-modal' },
    // Adicione mais itens conforme necessário
  ];
  statusChange: any = ''
  isSubmittingModal: boolean = false;
  casosMatriz: string [] = [];
  casosCentrais: string [] = [];
  casosTi: string[] = [];
  origensCasos: string[] = [
    'MATRIZ',
    'MATRIZ (TI)',
    'CENTRAIS'
  ];
  permissionsUsers: string[] = [];
  usersDisponiveis: Usuario[] = [
    
  ]
  usinasDisponiveis: any = [];
  categoriasDisponiveis: any = [];
  backgroundColor: any = 'primary'

  casosForm!: FormGroup;
  usinasDeleteForm!: FormGroup;
  categoriasDeleteForm!: FormGroup;
  permissionsForm!: FormGroup;
  usinasForm!: FormGroup;
  categoriaForm!: FormGroup;
  casosControl = new FormControl('');
  usinasControl = new FormControl('');
  categoriaControl = new FormControl('');
  problemas: Casos[] = [];
  problemasMatriz: Casos[] = [];
  problemasTi: Casos[] = [];
  problemasFiltrados = this.problemas;



  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private dataService: DataService,
    private usinasService: UsinasService
  ) {
    
  }

  ngOnInit(): void {
    this.getUsers();
    this.casosForm = this.fb.group({
      nome_caso: ['', Validators.required],
      origem_caso: ['', Validators.required],
    });
    this.usinasDeleteForm = this.fb.group({
      usina_delete: ['', Validators.required]
    });
    this.categoriasDeleteForm = this.fb.group({
      categoria_delete: ['', Validators.required]
    });
    this.usinasForm = this.fb.group({
      nome_usina: ['', Validators.required],
      status_usina: ['1'],
    });
    this.categoriaForm = this.fb.group({
      nome_categoria: ['', Validators.required],
      status_categoria: ['1'],
    });
    this.permissionsForm = this.fb.group({
      permission: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.getCasos();
    // Recalcula os problemas sempre que a origem mudar
    this.casosForm.get('origem_caso')?.valueChanges.subscribe((value) => {
      this.updateProblemas(value);
    });
    this.getPermissions();
    this.getUsinas();

    this.getCategorias();
  }

  getUsers() {
    this.dataService.getUsers().subscribe(
      data => {
        this.usersDisponiveis = data.map((item: any) => item);
  
        console.log(data); // Dados completos retornados pela API
        console.log(this.usersDisponiveis); // Apenas os nomes das permissões
      },
      error => {
        console.error('Erro ao buscar permissões:', error);
        this.toastr.error('Erro ao buscar permissões');
      }
    );
  }


  getPermissions() {
    this.dataService.getPermissions().subscribe(
      data => {
        // Extrair apenas os valores de permission_name
        this.permissionsUsers = data.map((item: any) => item.permission_name);
  
        console.log(data); // Dados completos retornados pela API
        console.log(this.permissionsUsers); // Apenas os nomes das permissões
      },
      error => {
        console.error('Erro ao buscar permissões:', error);
        this.toastr.error('Erro ao buscar permissões');
      }
    );
  }

  getUsinas() {
    this.dataService.getUsinas().subscribe(
      data => {
        // Extrair apenas os valores de permission_name
        this.usinasDisponiveis = data
  
        console.log(data); // Dados completos retornados pela API
        console.log(this.usinasDisponiveis); // Apenas os nomes das permissões
      },
      error => {
        console.error('Erro ao buscar usinas:', error);
        this.toastr.error('Erro ao buscar usinas');
      }
    );
  }

  getCategorias() {
    this.dataService.getCategorias().subscribe(
      data => {
        
        this.categoriasDisponiveis = data
  
        console.log(data); // Dados completos retornados pela API
        console.log(this.categoriasDisponiveis); 
      },
      error => {
        console.error('Erro ao buscar usinas:', error);
        this.toastr.error('Erro ao buscar usinas');
      }
    );
  }
  

  updateProblemas(origem: string): void {
    if (origem === 'MATRIZ') {
      this.problemasFiltrados = this.problemasMatriz;
    } else if (origem === 'MATRIZ (TI)') {
      this.problemasFiltrados = this.problemasTi;
    } else if (origem === 'CENTRAIS') {
      this.problemasFiltrados = this.problemas;
    } else {
      this.problemasFiltrados = [];
    }
  }

  onAdd(type: string) {
    
  }


  onSubmit() {
    console.log(this.casosForm.value);
    this.isSubmittingModal = true;
    const novoAtendimento: Casos = this.casosForm.value;
    this.toastr.warning('Trabalhando na sua solicitação');
      this.dataService.addCasos(novoAtendimento).subscribe(
        response => {
          console.log('Caso inserido com sucesso:', response);
          this.toastr.success('Caso criado com sucesso');
          this.isSubmittingModal = false;
          window.location.reload();
        },
        error => {
          console.error('Erro ao criar caso:', error);
          this.toastr.error('Erro ao criar caso');
          this.isSubmittingModal = false;
        })

  }

  onSubmitUsers() {
    console.log(this.permissionsForm.value);
    this.isSubmittingModal = true;
    const novoUsuario: any = this.permissionsForm.value;
    this.toastr.warning('Trabalhando na sua solicitação');
      this.dataService.addUser(novoUsuario).subscribe(
        response => {
          console.log('Usuário inserido com sucesso:', response);
          this.toastr.success('Usuário criado com sucesso');
          this.isSubmittingModal = false;
          window.location.reload();
        },
        error => {
          console.error('Erro ao criar usuário:', error);
          this.toastr.error('Erro ao criar usuário');
          this.isSubmittingModal = false;
        })

  }

  onSubmitDelete() {
    const selectedCaseId = this.casosForm.get('nome_caso')?.value.id;
    this.toastr.warning('Trabalhando na sua solicitação');
      this.dataService.deleteCasos(selectedCaseId).subscribe(
        response => {
          console.log('Caso excluído com sucesso:', response);
          this.toastr.success('Caso excluído com sucesso');
          this.isSubmittingModal = false;
          window.location.reload();
        },
        error => {
          console.error('Erro ao excluir caso:', error);
          this.toastr.error('Erro ao excluir caso');
          this.isSubmittingModal = false;
        })
  }

  onSubmitUsinas() {
    this.isSubmittingModal = true;
    const novaUsina: Usinas = this.usinasForm.value;
    this.toastr.warning('Trabalhando na sua solicitação');
    console.log(novaUsina)
      this.dataService.addUsinas(novaUsina).subscribe(
        response => {
          console.log('Usina inserida com sucesso:', response);
          this.toastr.success('Usina inserida com sucesso');
          this.isSubmittingModal = false;
          window.location.reload();
        },
        error => {
          console.error('Erro ao criar usina:', error);
          this.toastr.error('Erro ao criar usina');
          this.isSubmittingModal = false;
        })
  }

  onSubmitDeleteUsinas() {
    console.log(this.usinasDeleteForm.value);

    this.isSubmittingModal = true;

    // Acessa diretamente o campo 'usina_delete'
    const usinaDelete: any = this.usinasDeleteForm.value.usina_delete;

    const idUsinaDelete: any = (usinaDelete.id); // Agora deve exibir o 'id' corretamente

    this.dataService.deleteUsinas(idUsinaDelete).subscribe(
      response => {
        console.log('Usina excluída com sucesso:', response);
        this.toastr.success('Usina excluída com sucesso');
        this.isSubmittingModal = false;
        window.location.reload();
      },
      error => {
        console.error('Erro ao excluir usina:', error);
        this.toastr.error('Erro ao excluir usina');
        this.isSubmittingModal = false;
      })
  }

  onSubmitDeleteCategorias() {
    console.log(this.categoriasDeleteForm.value);

    this.isSubmittingModal = true;

    // Acessa diretamente o campo 'usina_delete'
    const usinaDelete: any = this.categoriasDeleteForm.value.categoria_delete;

    const idUsinaDelete: any = (usinaDelete.id); // Agora deve exibir o 'id' corretamente

    this.dataService.deleteCategoria(idUsinaDelete).subscribe(
      response => {
        console.log('Categoria excluída com sucesso:', response);
        this.toastr.success('Categoria excluída com sucesso');
        this.isSubmittingModal = false;
        window.location.reload();
      },
      error => {
        console.error('Erro ao excluir categoria:', error);
        this.toastr.error('Erro ao excluir categoria');
        this.isSubmittingModal = false;
      })
  }

  onSubmitCategorias() {
    console.log(this.categoriaForm.value);
    this.isSubmittingModal = true;
    const novaCategoria: Usinas = this.categoriaForm.value;
    this.toastr.warning('Trabalhando na sua solicitação');
      this.dataService.addCategoria(novaCategoria).subscribe(
        response => {
          console.log('Categoria inserida com sucesso:', response);
          this.toastr.success('Categoria inserida com sucesso');
          this.isSubmittingModal = false;
          window.location.reload();
        },
        error => {
          console.error('Erro ao criar categoria:', error);
          this.toastr.error('Erro ao criar categoria');
          this.isSubmittingModal = false;
        })
  }

  openModal(id: string) {
    const modal = document.getElementById(id);
    if (id === 'users-modal-delete') {
      this.toastr.error('Ação temporariamente bloqueada pelo administrador.');
    }
    console.log(modal)
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

  getCasos() {
    this.dataService.getCasos().subscribe(
      data => {
        data.forEach((caso: any) => {
          if (caso.origem_caso === 'CENTRAIS') {
            this.problemas.push(caso);
          } else if (caso.origem_caso === 'MATRIZ') {
            this.problemasMatriz.push(caso);
          } else if (caso.origem_caso === 'MATRIZ (TI)') {
            this.problemasTi.push(caso);
          }
        });
    
        console.log('Problemas (Centrais):', this.problemas);
        console.log('Problemas (Matriz):', this.problemasMatriz);
        console.log('Problemas (Matriz TI):', this.problemasTi);
      },
      error => {
        console.error('Erro ao buscar casos:', error);
        this.toastr.error('Erro ao buscar casos');
      }
    );
  }

  toggleAtivacao(user: any) {
    if (user.ativo === '1') {
        this.statusChange = { ativo: '2' };
    } else {
        this.statusChange = { ativo: '1' };
    }

    console.log(this.statusChange);

    this.dataService.changeStatusUser(user.id, this.statusChange).subscribe(
        response => {
            console.log('Status do usuário alterado com sucesso:', response);
            this.toastr.success('Status do usuário alterado com sucesso');
            this.isSubmittingModal = false;
            user.ativo = user.ativo === '1' ? '2' : '1';
            console.log(`Usuário ${user.username} agora está ${user.ativo === '1' ? 'Ativo' : 'Inativo'}`);
        },
        error => {
            console.error('Erro ao alterar status:', error);
            this.toastr.error('Erro ao alterar status');
            this.isSubmittingModal = false;
        }
    );
}
  

}
