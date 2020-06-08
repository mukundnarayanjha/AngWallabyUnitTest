import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RestApiService } from '../shared/rest-api.service';
import { Employee } from '../shared/employee';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {

  employees: Employee[] = [];
  employee: any;

  constructor(
    public restApi: RestApiService
  ) { }

  ngOnInit() {
    this.loadEmployees();
  }

  getEmployeeId(employeeId: any) {
    this.restApi.getEmployee(employeeId).subscribe((employee: Employee) => {
      this.employee = employee;
    });
  }

  // Get employees list
  loadEmployees() {
    return this.restApi.getEmployees().subscribe((employees: Employee[]) => {
      this.employees = employees;
    });
  }

  // Delete employee
  deleteEmployee(id: any) {
    if (window.confirm('Are you sure, you want to delete?')) {
      this.restApi.deleteEmployee(id).subscribe(data => {
        this.loadEmployees();
      });
    }
  }
}
