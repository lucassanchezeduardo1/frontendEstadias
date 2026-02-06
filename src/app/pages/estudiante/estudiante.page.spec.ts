import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EstudiantePage } from './estudiante.page';

describe('EstudiantePage', () => {
  let component: EstudiantePage;
  let fixture: ComponentFixture<EstudiantePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EstudiantePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
