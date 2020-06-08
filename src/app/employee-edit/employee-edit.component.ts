import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { RestApiService } from '../shared/rest-api.service';
import { Employee } from '../shared/employee';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.scss']
})
export class EmployeeEditComponent implements OnInit, OnChanges {
  @Input() employeeData: Employee;
  @Output() loadUpdateEmployeeFun: EventEmitter<any> = new EventEmitter();

  employeeUpdateForm: FormGroup;
  message: any;
  submitted = false;

  constructor(
    public restApi: RestApiService ,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.createForm();
  }
  ngOnChanges(): void {
    this.submitted = false;
    this.employeeUpdateForm.patchValue({
      name: this.employeeData.name,
      email: this.employeeData.email,
      phone: this.employeeData.phone
    });
  }
  createForm() {
    this.employeeUpdateForm = this.fb.group({
      name: [''],
      email: [''],
      phone: ['']
    });
  }
  // Update employee data
  updateEmployee() {
    if (window.confirm('Are you sure, you want to update?')) {
      this.restApi.updateEmployeeData(this.employeeData.id, this.employeeUpdateForm.value).subscribe((employee: Employee) => {
        if (employee) {
          this.onSuccess();
          this.submitted = true;
          this.loadUpdateEmployeeFun.emit();
          this.ClearEditForm();
        }
        else {
          this.onFailure();
        }
      },
        error => {
          this.onFailure();
        });
    }
  }
  onSuccess() {
    this.message = 'Success';
  }
  onFailure() {
    this.message = 'fail';
  }

  ClearEditForm()
  {
    this.employeeUpdateForm.patchValue({
      name: '',
      email: '',
      phone: ''
    });
  }
}
