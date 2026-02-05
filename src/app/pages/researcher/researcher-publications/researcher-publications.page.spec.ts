import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResearcherPublicationsPage } from './researcher-publications.page';

describe('ResearcherPublicationsPage', () => {
  let component: ResearcherPublicationsPage;
  let fixture: ComponentFixture<ResearcherPublicationsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearcherPublicationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
