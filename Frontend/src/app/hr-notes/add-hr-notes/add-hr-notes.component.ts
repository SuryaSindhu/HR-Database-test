import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'pm-add-hr-notes',
  templateUrl: './add-hr-notes.component.html',
  styleUrls: ['./add-hr-notes.component.css']
})
export class AddHrNotesComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddHrNotesComponent>) { }
  form!: FormGroup;

  ngOnInit(): void {
    this.form = new FormGroup({
      date: new FormControl(''),
      context: new FormControl(''),
    });
  }

  onSubmit() {
    this.dialogRef.close(this.form.value);
  }

  onCancel() {
    this.dialogRef.close();
  }

}
