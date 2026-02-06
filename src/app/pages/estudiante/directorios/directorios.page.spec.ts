import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DirectoriosPage } from './directorios.page';

describe('DirectoriosPage', () => {
  let component: DirectoriosPage;
  let fixture: ComponentFixture<DirectoriosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectoriosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
