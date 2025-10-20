import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdvComponent } from './pdv.component';

describe('PdvComponent', () => {
  let component: PdvComponent;
  let fixture: ComponentFixture<PdvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PdvComponent]
    });
    fixture = TestBed.createComponent(PdvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
