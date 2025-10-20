import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  isPanning = false;
  step = 0;
  faqForm: FormGroup;
  imagemSelecionada: File | null = null;
  userName: string = '';
  formData = new FormData();
  faqs: any[] = [];
  filteredFaqs: any[] = [];
  searchText: string = '';
  restritoPassword: string = '';
  idExclusao: any;
  faqsVazio: boolean = true;
  isSubmitting: boolean = false;
  

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dataService: DataService,
    private toastr: ToastrService,
    ) {
    this.faqForm = this.fb.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getFaqs();
  }

  getUserName() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    const userName = currentUser.username
    this.userName = userName
  }
  
  filterFaqs(): void {
    const searchLower = this.searchText.toLowerCase();
    this.filteredFaqs = this.faqs.filter(faq =>
      faq.titulo.toLowerCase().includes(searchLower) ||
      faq.descricao.toLowerCase().includes(searchLower)
    );
    this.faqsVazio = this.filteredFaqs.length === 0;
  }
  getFaqs(): void {
    this.dataService.getFaqs().subscribe(
      (data) => {
        this.faqs = data;  // Salva as FAQs retornadas pela API
        this.filteredFaqs = [...this.faqs];
  
        // Verifica se o array está vazio
        this.faqsVazio = this.filteredFaqs.length === 0;
        console.log(this.faqsVazio)
      },
      (error) => {
        console.error('Erro ao buscar as FAQs', error);
      }
    );
  }
  

  deleteFaq(id: any): void {

    this.dataService.deleteFaqs(id).subscribe(
      (data) => {
        this.toastr.success('FAQ deletado com sucesso!');
        window.location.reload();
      },
      (error) => {
        console.error('Erro ao deletar FAQ', error);
      }
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imagemSelecionada = input.files[0];
    }
  }

  onSubmit(): void {
    this.isSubmitting = true;
    if (!this.imagemSelecionada) {
      this.getUserName();
      const formData = new FormData();
      formData.append('titulo', this.faqForm.get('titulo')?.value);
      formData.append('descricao', this.faqForm.get('descricao')?.value);
      formData.append('userName', this.userName);
      this.formData = formData;
    }
    if (this.imagemSelecionada) {
      
    this.getUserName();
    const formData = new FormData();
    formData.append('titulo', this.faqForm.get('titulo')?.value);
    formData.append('descricao', this.faqForm.get('descricao')?.value);
    formData.append('imagem', this.imagemSelecionada);
    formData.append('userName', this.userName);
    this.formData = formData;
    }

    this.dataService.addFaqs(this.formData).subscribe(
      response => {
        console.log(this.formData)
        this.toastr.success('Problema registrado com sucesso!');
        this.faqForm.reset();
        this.imagemSelecionada = null;
        window.location.reload();
      },
      error => {
        console.error(error);
        alert('Ocorreu um erro ao registrar o problema.');
      }
    );
  }

  setStep(index: number) {
    this.step = index;
  }

  closeModal(id: string) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.style.display = 'none';
    }
  }

  openModal(id: string) {
    this.idExclusao = id;
    const modal = document.getElementById('card-modal-confirm');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  openModalConfirm() {
    if (this.restritoPassword === 'Lagos2023') {
      this.deleteFaq(this.idExclusao);
      this.closeModal('card-modal-confirm');
      this.toastr.success('Senha correta');
      
    }
    else {
      this.toastr.error('Senha incorreta, acesso negado')
    }
  }
}
