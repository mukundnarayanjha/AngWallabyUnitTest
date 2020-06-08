import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../shared/rest-api.service';
import { Employee } from '../shared/employee';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-employee-create',
  templateUrl: './employee-create.component.html',
  styleUrls: ['./employee-create.component.scss']
})
export class EmployeeCreateComponent implements OnInit {

  employeeForm: FormGroup;
  submitted = false;
  message: any;

  constructor(
    public restApi: RestApiService,
    private fb: FormBuilder
  ) { }

  ngOnInit() { this.createForm(); }

  createForm() {
    this.employeeForm = this.fb.group({
      name: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['']
    });
  }
  addEmployee() {
    if (!this.employeeForm.invalid) {
      this.restApi.createEmployee(this.employeeForm.value).subscribe((data: Employee) => {
        if (data) {
          this.onSuccess();
          this.submitted = true;
        }       
      },
        (error) => {
          this.onFailure();
        });
    }
    else {
      this.message = 'error';
    }
  }
  onSuccess() {
    this.message = 'Success';
  }
  onFailure() {
    this.message = 'fail';
  }
}
