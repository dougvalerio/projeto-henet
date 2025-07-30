import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrosselVideoComponent } from './carrossel-video.component';

describe('CarrosselVideoComponent', () => {
  let component: CarrosselVideoComponent;
  let fixture: ComponentFixture<CarrosselVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarrosselVideoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarrosselVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
