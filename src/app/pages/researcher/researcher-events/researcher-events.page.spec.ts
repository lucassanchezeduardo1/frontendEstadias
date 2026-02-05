import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResearcherEventsPage } from './researcher-events.page';

describe('ResearcherEventsPage', () => {
  let component: ResearcherEventsPage;
  let fixture: ComponentFixture<ResearcherEventsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearcherEventsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
