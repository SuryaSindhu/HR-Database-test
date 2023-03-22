import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { DetailsService } from 'src/app/details.service';

// Validator to check if age>18
function checkAge(c:AbstractControl):{[key: string]: boolean} | null {
  if(c.value!=null && Math.abs(new Date().getFullYear() - (+c.value.slice(0,4)))  < 18) {
    return {'child': true};
  }
  return null;
}

@Component({
  selector: 'pm-create-modify-employee',
  templateUrl: './create-modify-employee.component.html',
  styleUrls: ['./create-modify-employee.component.css']
})
export class CreateModifyEmployeeComponent implements OnInit {
  empDetails:any;
  modifyEmp: Number = 0;
  pageTitle: string = "Create new Employee";

  constructor(private route: ActivatedRoute,
              private router: Router,
              private detailsService: DetailsService,
              private fb: FormBuilder) { }
  form!: FormGroup;

  ngOnInit(): void {

    // Form creation to create new employee
    this.form = this.fb.group({
      firstName: '',
      middleName: '',
      lastName: '',
      dob: ['', checkAge],
      email: ['', Validators.email],
      salary: ['',Validators.required],
      latitude: '',
      longitude: '',
      startDate: ['',Validators.required]
    })

    // Pre-fill form values if it is modify employee data
    this.modifyEmp = Number(this.route.snapshot.paramMap.get('id'));

    if(this.modifyEmp!=0) {
      this.pageTitle = "Update employee";

      this.detailsService.getEmpById(this.modifyEmp)
        .subscribe(data=>{this.empDetails = data[0];
          this.form.patchValue({
            firstName : this.empDetails.first_name,
            middleName: this.empDetails.middle_name,
            lastName: this.empDetails['last_name'],
            dob: this.empDetails['dob'],
            email: this.empDetails['email'],
            salary: this.empDetails['salary_usd'],
            latitude: this.empDetails['latitude'],
            longitude: this.empDetails['longitude'],
            startDate: this.empDetails['start_date']
          });
      },
        error => console.log(error));
    }
  }

  // On Form submission
  onSubmit() {
    // Service to modify employee details
    if(this.modifyEmp!=0){
      this.detailsService.updateEmp(this.modifyEmp,this.form.value).subscribe(res=>{
        if(res)
          console.log('updated emp details successfully');
          this.router.navigate(['/employees']);
        },
        (error) => {
          console.log(error);
          alert('Full name should not be more than 50 characters');
          this.form.get('firstName')?.setValue('');
          this.form.get('middleName')?.setValue('');
          this.form.get('lastName')?.setValue('');
        }
      )
    }

    // Service to create new employee
    else{
      this.detailsService.createNewEmp(this.form.value).subscribe(response=>{
        if(response)
          console.log('new emp created successfully');
          this.router.navigate(['/employees']);
        },
        (error) => {
          console.log(error);
          alert('Full name should not be more than 50 characters');
          this.form.get('firstName')?.setValue('');
          this.form.get('middleName')?.setValue('');
          this.form.get('lastName')?.setValue('');
        }
      )
    }
  }

  //On Cancel form
  onCancel() {
    this.router.navigate(['/employees']);
  }
}
