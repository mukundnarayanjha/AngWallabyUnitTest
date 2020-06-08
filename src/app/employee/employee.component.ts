import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestApiService } from '../shared/rest-api.service';
import { Employee } from '../shared/employee';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  employees: Employee[] = [];
  observationEmployees: Employee[] = [];
  employee: any;
  message: any;

  showIdControl = false;
  submitted = false;
  Disabled = false;
  ShowAddPerson = true;
  constructor(
    public restApi: RestApiService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loadEmployees();
    this.loadUnderObservationEmployees();
    this.createForm();
  }
  loadEmployees() {
    return this.restApi.getEmployees().subscribe((employees: Employee[]) => {
      this.employees = employees;
    });
  }
  loadUnderObservationEmployees() {
    return this.restApi.getAllUnderObservationEmployees().subscribe((employees: Employee[]) => {
      this.observationEmployees = employees;
    });
  }
  createForm() {
    this.employeeForm = this.fb.group({
      id: [''],
      name: [''],
      email: [''],
      phone: ['']
    });
  }
  getEmployeeId(employeeId: any) {
    this.restApi.getEmployee(employeeId).subscribe((employee: Employee) => {
      this.employee = employee;
      this.fillRecordInEmployeeForm(this.employee);
      this.ShowAddPerson = true;
      this.Disabled = true;
    });
  }
  fillRecordInEmployeeForm(employee: Employee) {
    this.employeeForm.patchValue({
      id: this.employee.id,
      name: this.employee.name,
      email: this.employee.email,
      phone: this.employee.phone
    });
  }
  getUnderObservationEmployeeId(employeeId: any) {
    this.restApi.getUnderObservationEmployee(employeeId).subscribe((employee: Employee) => {
      this.employee = employee;
      this.fillRecordInEmployeeForm(this.employee);
      this.ShowAddPerson = false;
      this.Disabled = true;
    });
  }

  EUOSaveButtonClick() {
    this.restApi.createUnderObservationEmployee(this.employeeForm.value).subscribe((data: Employee) => {
      if (data) {
        this.onSuccess();
        this.loadUnderObservationEmployees();
        this.submitted = true;
      }
    },
      (error) => {
        this.onFailure();
      });
  }
  onSuccess() {
    this.message = 'Success';
  }
  onFailure() {
    this.message = 'fail';
  }

  EUORemoveButtonClick() {
    const id = this.employeeForm.get('id').value;
    if (window.confirm('Are you sure, you want to delete?')) {
      this.restApi.deleteUnderObservationEmployee(id).subscribe(() => {
        this.loadUnderObservationEmployees();
        this.submitted = true;
      },
        (error) => {
          this.onFailure();
        });
    }
  }
}

