import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHrNotesComponent } from './add-hr-notes.component';

describe('AddHrNotesComponent', () => {
  let component: AddHrNotesComponent;
  let fixture: ComponentFixture<AddHrNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddHrNotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHrNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
