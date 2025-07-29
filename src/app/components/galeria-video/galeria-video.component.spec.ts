import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaleriaVideoComponent } from './galeria-video.component';

describe('GaleriaVideoComponent', () => {
  let component: GaleriaVideoComponent;
  let fixture: ComponentFixture<GaleriaVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GaleriaVideoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GaleriaVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
