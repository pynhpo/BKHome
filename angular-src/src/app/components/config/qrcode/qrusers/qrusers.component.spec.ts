import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrusersComponent } from './qrusers.component';

describe('QrusersComponent', () => {
  let component: QrusersComponent;
  let fixture: ComponentFixture<QrusersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrusersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
