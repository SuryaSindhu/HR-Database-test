import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetailsService } from '../details.service';
import { MatDialog } from '@angular/material/dialog';
import { AddHrNotesComponent } from './add-hr-notes/add-hr-notes.component';


@Component({
  selector: 'pm-hr-notes',
  templateUrl: './hr-notes.component.html',
  styleUrls: ['./hr-notes.component.css']
})
export class HrNotesComponent implements OnInit {
  hrNotes: any;
  empName: any;
  id:any;

  constructor(private route: ActivatedRoute,
              private detailsService: DetailsService,
              private dialog: MatDialog,
              ) { }

  ngOnInit(): void {
    // Fetch employee's id and full name from route-parameters
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.empName = this.route.snapshot.queryParamMap.get('empName');

    this.getHrNotes();
  }

  // Service call to get hr-notes of an employee
  getHrNotes() {
    this.detailsService.getHrNotes(this.id)
      .subscribe(data=>{ this.hrNotes = data; console.log(this.hrNotes) },
                error => console.log(error));
  }

  // Open mat dialog to add new hr-notes for an employee
  openDialog() {
    const dialogRef = this.dialog.open(AddHrNotesComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!= undefined) {
        this.detailsService.postNewHrNote(this.id, result).subscribe(response => {
          if(response.success) {
            console.log('new hr-note inserted');
            this.getHrNotes();
          }
        })
      }
      console.log('res', result)
    });
  }
}
