import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DetailsService } from '../details.service';
import { CreateNewTeamComponent } from './create-new-team/create-new-team.component';

@Component({
  selector: 'pm-team-details',
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.css']
})
export class TeamDetailsComponent implements OnInit {
  teamDetails: any;
  emp_id: any;
  constructor(private detailsService: DetailsService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getTeamList();
  }

  // Service call to delete an employee
  deleteTeam(team_id: Number){
    this.detailsService.deleteTeam(team_id).subscribe(response => {
      if (response.success) {
        const index = this.teamDetails.findIndex((team: { team_id: Number; }) => team.team_id === team_id);
        if (index !== -1) {
          this.teamDetails.splice(index, 1);
        }
      }
    });
  }

  // Service call to get details of all teams
  getTeamList() {
    this.detailsService.getTeamDetails()
      .subscribe(data=>this.teamDetails = data,
                error => console.log(error));
  }

  // Open dialog to create a new team
  openDialog() {
    const dialogRef = this.dialog.open(CreateNewTeamComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!=undefined) {
        this.detailsService.createNewTeam(result).subscribe(response => {
          if(response.success) {
            console.log('team added');
          }
          this.getTeamList();
        })
      }
    });
  }
}
