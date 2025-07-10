import { DataService } from '@/src/app/services/data.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})
export class TutorialComponent implements OnInit {
  firstStepCompleted: boolean = false;
  secondStepCompleted: boolean = false;
  cursoId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.cursoId = params.get('id');
    });
    console.log(this.cursoId)
  }

  concluirPrimeiroPasso() {
    this.firstStepCompleted = true;
  }

  concluirSegundoPasso() {
    this.secondStepCompleted = true;
  }

  getProgresso() {
    
  }

}
