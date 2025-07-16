import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MobileCheckService {
  private isMobile: boolean;
  public isMobileChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {
    this.isMobile = this.detectMobile();
  }

  private detectMobile(): boolean {
    const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isMobileWidth = window.innerWidth < 1200;

    return isMobileUserAgent || isMobileWidth;
  }

  public getIsMobile(): boolean {
    return this.isMobile;
  }

  public checkMobile(): void {
    const newIsMobile = this.detectMobile();
    if (this.isMobile !== newIsMobile) {
      this.isMobile = newIsMobile;
      this.isMobileChanged.emit(this.isMobile);
    }
  }
}
