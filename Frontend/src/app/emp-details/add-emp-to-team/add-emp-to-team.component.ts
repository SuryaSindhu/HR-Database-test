import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DetailsService } from 'src/app/details.service';


@Component({
  selector: 'pm-add-emp-to-team',
  templateUrl: './add-emp-to-team.component.html',
  styleUrls: ['./add-emp-to-team.component.css']
})
export class AddEmpToTeamComponent implements OnInit {

  positions = ['ceo', 'cto', 'team lead', 'employee'];
  teams: any;

  constructor(public dialogRef: MatDialogRef<AddEmpToTeamComponent>,
              private detailsService: DetailsService,
              @Inject(MAT_DIALOG_DATA) public data:any) {}

  form!: FormGroup;

  ngOnInit(): void {
    // Service to fetch list of teams to populate dropdown
    this.detailsService.getTeamsList()
      .subscribe(data=>{this.teams = data; },
                error => error);
    this.form = new FormGroup({
      employeeName: new FormControl({value: this.data.empName, disabled: true}),
      team: new FormControl(''),
      position: new FormControl('')
    });
  }

  // On form submission, add employee to team
  onSubmit() {
    this.dialogRef.close(this.form.value);
    const body = {'team_id':this.form.value.team, 'position': this.form.value.position, 'emp_id': this.data.empId };
    this.detailsService.addEmpToTeam(body).subscribe(response => {
      if(response.success) {
        console.log('Employee added to team');
      }
    })
  }

  // On form cancel
  onCancel() {
    this.dialogRef.close();
  }
}
