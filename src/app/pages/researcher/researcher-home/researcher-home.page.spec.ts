import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResearcherHomePage } from './researcher-home.page';

describe('ResearcherHomePage', () => {
  let component: ResearcherHomePage;
  let fixture: ComponentFixture<ResearcherHomePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearcherHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
