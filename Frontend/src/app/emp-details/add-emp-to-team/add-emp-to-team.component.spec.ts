import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmpToTeamComponent } from './add-emp-to-team.component';

describe('AddEmpToTeamComponent', () => {
  let component: AddEmpToTeamComponent;
  let fixture: ComponentFixture<AddEmpToTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEmpToTeamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmpToTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
