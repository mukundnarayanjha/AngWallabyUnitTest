import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeEditComponent } from './employee-edit.component';
import { RestApiService } from '../shared/rest-api.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Employee } from '../shared/employee';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('EmployeeEditComponent', () => {
  let component: EmployeeEditComponent;
  let fixture: ComponentFixture<EmployeeEditComponent>;
  let service: RestApiService;
  const mockEmployee = { id: '1', name: 'Mukund Jha', email: 'mukund@gmail.com', phone: 9004186606 };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeEditComponent],
      imports: [ReactiveFormsModule, FormsModule, HttpClientModule, RouterTestingModule],
      providers: [RestApiService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.get(RestApiService);
  });

  afterEach(() => {
    service = null;
    component = null;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //#region  Component Method and variable

  it('should call the server to update a employee if the user confirms', () => {

    spyOn(window, 'confirm').and.returnValue(true);

    mockEmployee.name = 'Ram';
    mockEmployee.email = 'ram@gmail.com';
    component.employeeData = mockEmployee;
    fixture.detectChanges();

    const spy = spyOn(service, 'updateEmployeeData').and.returnValue(
      of(mockEmployee)
    );

    component.updateEmployee();

    service.updateEmployeeData(1, mockEmployee).subscribe((employee: Employee) => {
      expect(employee).toEqual(mockEmployee);
      expect(component.message).toEqual('Success');
      expect(spy).toHaveBeenCalledWith(1, mockEmployee);
    });
  });

  it('should call ngOnChanges', () => {
    component.employeeData = mockEmployee;
    const form = component.employeeUpdateForm;
    //spyOn(component, 'ngOnChanges').and.callThrough();
    component.ngOnChanges();
    fixture.detectChanges();
    form.patchValue({ name: 'mukund', email: 'mukund@gmai.com', phone: '9007656678' });
    expect(false).toEqual(component.submitted);
    expect(component.employeeUpdateForm.get('name').value).toEqual('mukund');
  })

  // it('sending form values to the service onSubmit method', () => {
  //   // assuming the property on the component is named employeeUpdateForm
  //   const form = component.employeeUpdateForm;
  //   component.ngOnInit();
  //   form.patchValue({ name: 'mukund', email: 'mukund@gmai.com', phone: '9007656678' });
  // });

  // it('should NOT call the server to update a employee if the user cancels', () => {
  //   spyOn(window, 'confirm').and.returnValue(false);
  //   const spy = spyOn(service, 'updateEmployeeData').and.returnValue(
  //     empty()
  //   );
  //   const id = 1;
  //   component.updateEmployee();

  //   expect(spy).not.toHaveBeenCalledWith(id, mockEmployee);
  // });

  //#endregion

  //#region  Dom Element

  // it('should render input elements', () => {
  //   const compiled = fixture.debugElement.nativeElement;
  //   const nameInput = compiled.querySelector('input[id="name"]');
  //   const emailInput = compiled.querySelector('input[id="email"]');
  //   const phoneInput = compiled.querySelector('input[id="phone"]');
  //   expect(nameInput).toBeTruthy();
  //   expect(emailInput).toBeTruthy();
  //   expect(phoneInput).toBeTruthy();
  // });

  // it('should display the Update Employee button', () => {
  //   const compiled = fixture.nativeElement;
  //   expect(compiled.innerText).toContain('Update Employee');
  // });

  //#endregion

});
