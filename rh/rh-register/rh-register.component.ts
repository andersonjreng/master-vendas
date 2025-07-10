import { DataService } from '@/src/app/services/data.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, startWith, map } from 'rxjs';
import { validators } from 'tailwind-merge';

@Component({
  selector: 'app-rh-register',
  templateUrl: './rh-register.component.html',
  styleUrls: ['./rh-register.component.scss']
})
export class RhRegisterComponent implements OnInit {

  isMatriz: boolean = false;

  rhForm!: FormGroup;

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
    private fb: FormBuilder,
    private dataService: DataService,
    private toastr: ToastrService,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
    this.rhForm = this.fb.group({
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
  // {
  //     validators: this.usinaOpcaoValidator.bind(this)
  //   }
  );

    this.filteredUsinas = this.usinaControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterUsinas(value || '')
        ));
  }

  onSubmit() {


    if (this.rhForm.valid) {
          this.isSubmitting = true;
          const novoRegistro = this.rhForm.value;
          console.log(novoRegistro)
          this.toastr.warning('Trabalhando na sua solicitação');
          this.dataService.addCargo(novoRegistro).subscribe(
            response => {
              console.log('Solicitação inserida com sucesso:', response);
              this.toastr.success('Solicitação criada com sucesso');
              this.isSubmitting = false;
              window.location.reload();
            },
            error => {
              console.error('Erro ao criar solicitação:', error);
              this.toastr.error('Erro ao criar solicitação');
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

      
  returnRh() {
    this.router.navigate(['/app/rh']);
  }

}
