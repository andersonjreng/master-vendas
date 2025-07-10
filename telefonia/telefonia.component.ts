import { Component, HostListener, Injectable, OnInit, ViewChild, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MobileCheckService } from '../../services/mobile-check.service';
import { ApiService } from '../../services/api.service';
import { TransfMovement } from '../../domain/interfaces/stock';
import { Observable, forkJoin, of, timer } from 'rxjs';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import {MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {Subject} from 'rxjs';
import '@angular/localize/init';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../services/data.service';


@Component({
  selector: 'app-telefonia',
  templateUrl: './telefonia.component.html',
  styleUrls: ['./telefonia.component.scss']
})
export class TelefoniaComponent implements OnInit {

  nomeUsuario: any;

  telefoniaForm: FormGroup;
  editForm!: FormGroup;
  idEdit: any = '';
  orderTelefonia: string = 'CRESCENTE'

  status: string[] = [
    "ABERTO",
    "EM ANDAMENTO",
    "FINALIZADO"
  ]

  urgencia: string[] = [
    "URGENTE",
    "NÃO URGENTE"
  ]

  dataTelefonia: any[] = [

  ]

  filteredData: any[] = [];
  selectedFilter: string = 'TODOS';
  
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private dataService: DataService,
  ){
    this.telefoniaForm = this.fb.group({
      modelo: ['', Validators.required],
      chip: [null, [Validators.required, Validators.min(1)]],
      solicitante: ['', Validators.required],
      dataSolicitado: ['', Validators.required],
      urgencia: ['', Validators.required],
      status_telefonia: ['ABERTO'], // Definido como padrão
      destino: ['', Validators.required],
      criado_por: [this.nomeUsuario]
    });
    this.editForm = this.fb.group({
      modelo: ['', Validators.required],
      chip: [null, [Validators.required, Validators.min(1)]],
      solicitante: ['', Validators.required],
      dataSolicitado: ['', Validators.required],
      urgencia: ['', Validators.required],
      status_telefonia: ['ABERTO'], // Definido como padrão
      destino: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getTelefonia();
    this.filteredData = this.dataTelefonia;
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    const userName = currentUser.username
    this.nomeUsuario = userName
    console.log(userName)
  }

  toggleOrder() {
    this.orderTelefonia = this.orderTelefonia === 'CRESCENTE' ? 'DECRESCENTE' : 'CRESCENTE';
    
    this.getTelefonia(); // Chama a função para atualizar os dados conforme a ordenação
  }

  getTelefonia() {
    if (this.orderTelefonia === 'CRESCENTE') {
      
      const todayDay = this.formatDate(new Date());
      this.dataService.getTelefonia('2000-01-01', '2100-01-01').subscribe(data => {
        this.dataTelefonia = data;
        this.filterStatus('TODOS');
        console.log(this.dataTelefonia)
      });
    } else {
      
      const todayDay = this.formatDate(new Date());
      this.dataService.getTelefoniaDesc('2000-01-01', '2100-01-01').subscribe(data => {
        this.dataTelefonia = data;
        this.filterStatus('TODOS');
        console.log(this.dataTelefonia)
      });
    
    
    }
  }
  

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  changeStatus(id: any, status: string) {
    console.log(id, status)
    const data = {
      status_telefonia: status
    }

    this.dataService.changeStatusTelefonia(id, data).subscribe(data => {
      console.log(data)
      this.toastr.success('Alteração realizada com sucesso')
      this.getTelefonia();
    });
  }

  filterStatus(status: string) {
    this.selectedFilter = status;
    if (status === 'TODOS') {
      this.filteredData = this.dataTelefonia;
    } else {
      this.filteredData = this.dataTelefonia.filter(item => item.status_telefonia === status);
    }
  }

  onSubmit() {
    if (this.telefoniaForm.valid) {
      
        const data = this.telefoniaForm.value;
        this.toastr.warning('Trabalhando na sua solicitação');
        console.log(data);
        this.dataService.addTelefonia(data).subscribe(
          response => {
            console.log('Registro inserido com sucesso:', response);
            this.toastr.success('Registro inserido com sucesso');
            
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
      
        const data = this.editForm.value;
        this.toastr.warning('Trabalhando na sua solicitação');
        console.log(data);
        this.dataService.updateTelefonia(this.idEdit, data).subscribe(
          response => {
            console.log('Registro atualizado com sucesso:', response);
            this.toastr.success('Registro atualizado com sucesso');
            
            window.location.reload();
          },
          error => {
            console.error('Erro ao atualizar registro:', error);
            this.toastr.error('Erro ao atualizar registro');
            
          }
        );
    }
  }

  openModal(item: any, id: string) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.style.display = 'block';
    }

    if (id === 'card-modal-edit') {
      this.editForm = this.fb.group({
        modelo: [item.modelo, Validators.required],
        chip: [item.chip, [Validators.required, Validators.min(1)]],
        solicitante: [item.solicitante, Validators.required],
        dataSolicitado: [item.dataSolicitado, Validators.required],
        urgencia: [item.urgencia, Validators.required],
        status_telefonia: [item.status_telefonia], // Definido como padrão
        destino: [item.destino, Validators.required]
      });
      this.idEdit = item.id;
    }
    
  }

  closeModal(id: string) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.style.display = 'none';
    }
    
  }
}
