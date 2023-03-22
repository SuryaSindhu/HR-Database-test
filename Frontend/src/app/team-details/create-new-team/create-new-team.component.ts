import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DetailsService } from 'src/app/details.service';

@Component({
  selector: 'pm-create-new-team',
  templateUrl: './create-new-team.component.html',
  styleUrls: ['./create-new-team.component.css']
})
export class CreateNewTeamComponent implements OnInit {

  emps: any;
  constructor(public dialogRef: MatDialogRef<CreateNewTeamComponent>,private detailsService: DetailsService,
    private router: Router,
    ) { }

  form!: FormGroup;

  ngOnInit(): void {
    // Service call to get employee list to populate dropdown
    this.detailsService.getEmpsList()
    .subscribe(data=>{this.emps = data; },
              error => error);

    this.form = new FormGroup({
      teamName: new FormControl(''),
      ceo: new FormControl(''),
      cto: new FormControl(''),
      lead: new FormControl(''),
      emps: new FormControl('')
    });
  }

  // On form submission
  onSubmit() {
    this.dialogRef.close(this.form.value);
  }

  // On form cancel
  onCancel() {
    this.dialogRef.close();
    this.router.navigate(['/teams']);
  }
}



