import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { GalleriaModule } from 'primeng/galleria';
import { MegaMenuModule } from 'primeng/megamenu';

@NgModule({
  imports: [
    CommonModule,
    CardModule,
    CarouselModule,
    GalleriaModule,
    MegaMenuModule,
  ],
  exports: [
    CardModule,
    CarouselModule,
    GalleriaModule,
    MegaMenuModule,
  ],
  declarations: []
})
export class StyledPrimeNgModule { }
