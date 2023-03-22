import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrNotesComponent } from './hr-notes.component';

describe('HrNotesComponent', () => {
  let component: HrNotesComponent;
  let fixture: ComponentFixture<HrNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HrNotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HrNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
