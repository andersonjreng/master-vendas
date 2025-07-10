import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RhRegisterComponent } from './rh-register.component';

describe('RhRegisterComponent', () => {
  let component: RhRegisterComponent;
  let fixture: ComponentFixture<RhRegisterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RhRegisterComponent]
    });
    fixture = TestBed.createComponent(RhRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
