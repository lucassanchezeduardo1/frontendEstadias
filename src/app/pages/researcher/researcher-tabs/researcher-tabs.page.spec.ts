import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResearcherTabsPage } from './researcher-tabs.page';

describe('ResearcherTabsPage', () => {
  let component: ResearcherTabsPage;
  let fixture: ComponentFixture<ResearcherTabsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearcherTabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
