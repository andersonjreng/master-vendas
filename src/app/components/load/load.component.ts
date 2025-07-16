import { AfterViewChecked, Component, Inject, Input, NgZone, OnInit, Optional, PLATFORM_ID } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { AnimationOptions, LottieTransferState } from "ngx-lottie";
import { isPlatformBrowser } from "@angular/common";
import { AnimationItem, BMDestroyEvent } from "lottie-web";

@Component({
  selector: 'app-load',
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.css']
})
export class LoadComponent implements OnInit, AfterViewChecked {
  options!: AnimationOptions;
  shown = true;
  width: string = '160px';
  height: string = '160px';
  private defaultPath = '/assets/load.json';

  @Input() path = '/assets/load.json';
  @Input() speed : number = 1.5;

  private animationItem: AnimationItem | null = null;

  constructor(
    private load: MatDialog,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: string,
    @Optional() @Inject(MAT_DIALOG_DATA) private data: any,
    private lottieTransferState: LottieTransferState,
  ) {
    if (this.data) {
        // Você pode acessar this.data aqui se estiver em um diálogo
        this.path = this.data.path;
        this.width = this.data.width;
        this.height = this.data.height;
      }
    this.createOptions();
  }

  ngAfterViewChecked(): void {
    if (isPlatformBrowser(this.platformId)) {
    }
  }

  animationCreated(animationItem: AnimationItem): void {
    NgZone.assertInAngularZone();
    this.animationItem = animationItem;
    this.setSpeed(this.speed);
  }

  destroy(destroyEvent: BMDestroyEvent): void {
    NgZone.assertNotInAngularZone();
    console.log('destroy -> ', destroyEvent);
  }

  showAnimation(): void {
    this.shown = true;
  }

  destroyAnimation(): void {
    this.shown = false;
    this.animationItem = null;
  }

  setSpeed(speed: number): void {
    this.ngZone.runOutsideAngular(() => {
      this.animationItem?.setSpeed(speed);
    });
  }

  play(): void {
    this.ngZone.runOutsideAngular(() => {
      this.animationItem?.play();
    });
  }

  pause(): void {
    this.ngZone.runOutsideAngular(() => {
      this.animationItem?.pause();
    });
  }

  stop(): void {
    this.ngZone.runOutsideAngular(() => {
      this.animationItem?.stop();
    });
  }

  updateAnimation(pathString: string): void {
    this.options = {
      path: pathString,
    };
  }

  updateLoop(loop: boolean){
    this.options = {
        ...this.options, // Mantenha as outras propriedades do objeto options
        loop: loop,
      };

      // Reinicie a animação com as novas opções
      this.play();
  }

  private createOptions(): void {
    const transferredAnimationData = this.lottieTransferState.get('data.json');
    console.log('createOptions -> ', this.path);
    if (transferredAnimationData) {
      this.options = {
        animationData: transferredAnimationData,
      };
    } else {
      this.options = {
        path: this.path,
        loop: true,
      };
    }
  }

  show(path?: string, width: string = "160px", height: string = "160px"): void {

    if (path) {
      this.path = path;
    } else {
      this.path = this.defaultPath;
    }


    this.load.open(LoadComponent, {
      id: this.path,
      disableClose: true,
      width: '200px',
      height: '200px',
      data: {
        path: path,
        width: width,
        heigth: height
    }
    });

    this.showAnimation();
  }

  hide(): void {
    this.load.getDialogById(this.path)?.close();
  }

  ngOnInit() {

    if (this.load && this.path) {
      this.path = this.path;
      this.speed = this.speed;
      this.setSpeed(this.speed);
      this.updateAnimation(this.path); // Atualize as opções da animação
    }
  }

}
