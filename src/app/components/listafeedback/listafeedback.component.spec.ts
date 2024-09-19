import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListafeedbackComponent } from './listafeedback.component';

describe('ListafeedbackComponent', () => {
  let component: ListafeedbackComponent;
  let fixture: ComponentFixture<ListafeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListafeedbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListafeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
