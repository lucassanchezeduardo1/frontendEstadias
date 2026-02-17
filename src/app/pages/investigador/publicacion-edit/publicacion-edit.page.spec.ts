import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicacionEditPage } from './publicacion-edit.page';

describe('PublicacionEditPage', () => {
  let component: PublicacionEditPage;
  let fixture: ComponentFixture<PublicacionEditPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicacionEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
