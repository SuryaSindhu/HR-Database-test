import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateModifyEmployeeComponent } from './create-modify-employee.component';

describe('CreateModifyEmployeeComponent', () => {
  let component: CreateModifyEmployeeComponent;
  let fixture: ComponentFixture<CreateModifyEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateModifyEmployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateModifyEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
