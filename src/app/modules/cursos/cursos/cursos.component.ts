import { Cursos } from '@/src/app/interfaces/cursos';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.scss']
})
export class CursosComponent implements OnInit {

  cursosDisponiveis: Cursos[] = [
    {
      id: 1,
      nome_curso: "TRILHA ADMINISTRATIVO",
      origem_curso: 2,
      img_curso: "assets/curso_2.jpg",
      descricao: "Aprenda os processos essenciais administrativos da empresa."
    },
    {
      id: 2,
      nome_curso: "TRILHA OPERACIONAL PARA USINAS",
      origem_curso: 2,
      img_curso:"assets/curso_1.jpg",
      descricao: "Aprenda os processos essenciais operacionais das usinas da Concrelagos."
    },
    {
      id: 3,
      nome_curso: "TRILHA COMERCIAL",
      origem_curso: 2,
      img_curso:"assets/curso_3.jpg",
      descricao: "Aprenda os processos essenciais do setor comercial da Concrelagos."
    },
  ]

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    
  }

  navigateToTutorial(id: any) {
    this.router.navigate([id], { relativeTo: this.route });
  }
  
}
