import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvestigadorPage } from './investigador.page';

describe('InvestigadorPage', () => {
  let component: InvestigadorPage;
  let fixture: ComponentFixture<InvestigadorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigadorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
