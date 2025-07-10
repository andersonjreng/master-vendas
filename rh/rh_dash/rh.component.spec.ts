import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RhComponent } from './rh.component';

describe('RhComponent', () => {
  let component: RhComponent;
  let fixture: ComponentFixture<RhComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RhComponent]
    });
    fixture = TestBed.createComponent(RhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
