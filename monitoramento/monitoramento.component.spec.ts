import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoramentoComponent } from './monitoramento.component';

describe('MonitoramentoComponent', () => {
  let component: MonitoramentoComponent;
  let fixture: ComponentFixture<MonitoramentoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonitoramentoComponent]
    });
    fixture = TestBed.createComponent(MonitoramentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
