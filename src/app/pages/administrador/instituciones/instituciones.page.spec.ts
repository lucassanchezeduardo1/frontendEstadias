import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InstitucionesPage } from './instituciones.page';

describe('InstitucionesPage', () => {
  let component: InstitucionesPage;
  let fixture: ComponentFixture<InstitucionesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitucionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
