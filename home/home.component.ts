import { Component, HostListener, OnInit } from '@angular/core';
import { MobileCheckService } from '../../services/mobile-check.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isMobile: boolean = false;

  constructor(
    private mobileCheckService: MobileCheckService,
    
  ) {

    
  }

  ngOnInit(): void {

    this.isMobile = this.mobileCheckService.getIsMobile();
    this.mobileCheckService.isMobileChanged.subscribe((isMobile: boolean) => {
      this.isMobile = isMobile;
    });

  }

  @HostListener('window:resize')
    onResize() {
      // Atualiza a variável isMobile ao redimensionar a janela
      this.mobileCheckService.checkMobile();
    }
  
  
}
