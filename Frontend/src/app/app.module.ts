import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { EmpDetailsComponent } from './emp-details/emp-details.component';
import { DetailsService } from './details.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TeamDetailsComponent } from './team-details/team-details.component';
import { RouterModule } from '@angular/router';
import { EmpModule } from './emp-details/emp.module';
import { CreateNewTeamComponent } from './team-details/create-new-team/create-new-team.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    AppComponent,
    TeamDetailsComponent,
    CreateNewTeamComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    EmpModule,
    RouterModule.forRoot([
      {path: 'employees', component: EmpDetailsComponent},
      { path: 'teams', component: TeamDetailsComponent},
      { path: '', redirectTo: 'employees', pathMatch: 'full' },
      { path: '**', redirectTo: 'employees', pathMatch: 'full' }
    ]),
  ],
  providers: [DetailsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
