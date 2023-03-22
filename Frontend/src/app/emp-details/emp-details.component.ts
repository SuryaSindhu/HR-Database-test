import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DetailsService } from '../details.service';
import { AddEmpToTeamComponent } from './add-emp-to-team/add-emp-to-team.component';


@Component({
  selector: 'pm-emp-details',
  templateUrl: './emp-details.component.html',
  styleUrls: ['./emp-details.component.css']
})
export class EmpDetailsComponent implements OnInit {
  empDetails: any;
  constructor(private detailsService: DetailsService,
              private dialog: MatDialog) { }


  ngOnInit(): void {
    // Service to get all employee details
    this.detailsService.getEmpDetails()
      .subscribe(data=>this.empDetails = data,
                error => console.log(error));
  }

  // Service to delete an employee
  deleteEmp(Emp_id: Number) {
    this.detailsService.deleteEmp(Emp_id).subscribe(response => {
      if (response.success) {
        const index = this.empDetails.findIndex((emp: { employee_id: Number; }) => emp.employee_id === Emp_id);
        if (index !== -1) {
          this.empDetails.splice(index, 1);
        }
      }
    });
  }

  // Open dialog to associate an employee to a team
  openDialog(employee_id: Number,empName: string) {
    const dialogRef = this.dialog.open(AddEmpToTeamComponent, {
      width: '500px',
      data: {
        empName: empName,
        empId: employee_id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('res', result)
    });
  }
}
