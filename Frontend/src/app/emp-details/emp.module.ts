import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HrNotesComponent } from '../hr-notes/hr-notes.component';
import { EmpDetailsComponent } from './emp-details.component';
import { CommonModule } from '@angular/common';
import { AddHrNotesComponent } from '../hr-notes/add-hr-notes/add-hr-notes.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CreateModifyEmployeeComponent } from './create-modify-employee/create-modify-employee.component';
import { AddEmpToTeamComponent } from './add-emp-to-team/add-emp-to-team.component';
import {MatSelectModule} from '@angular/material/select';




@NgModule({
  declarations: [
    EmpDetailsComponent,
    HrNotesComponent,
    AddHrNotesComponent,
    CreateModifyEmployeeComponent,
    AddEmpToTeamComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    RouterModule.forChild([
      { path: 'employees',
        children:[
          {path:'', component: EmpDetailsComponent},
          {path: 'hr-notes/:id', component: HrNotesComponent},
          {path:'modify/:id', component: CreateModifyEmployeeComponent},
          {path:'create', component: CreateModifyEmployeeComponent}
          ]
      },
    ]),
  ],
  exports:[
    EmpDetailsComponent
  ]
})
export class EmpModule { }
