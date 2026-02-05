import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResearcherProfilePage } from './researcher-profile.page';

describe('ResearcherProfilePage', () => {
  let component: ResearcherProfilePage;
  let fixture: ComponentFixture<ResearcherProfilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearcherProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
