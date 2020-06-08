import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeCreateComponent } from './employee-create.component';
import { RestApiService } from '../shared/rest-api.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Employee } from '../shared/employee';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('EmployeeCreateComponent', () => {
  let component: EmployeeCreateComponent;
  let fixture: ComponentFixture<EmployeeCreateComponent>;
  let mockEmployee: Employee;
  let service: RestApiService;
  // let el: HTMLElement;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeCreateComponent],
      imports: [ReactiveFormsModule, HttpClientModule, RouterTestingModule],
      providers: [RestApiService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeCreateComponent);
    component = fixture.componentInstance;
    service = TestBed.get(RestApiService);
    fixture.detectChanges();
    mockEmployee = { id: '1', name: 'Mukund', email: 'mukund@gmail.com', phone: 9004186606 };
  });

  //#region  Component Method
  it('should save employee details when form is submitted', () => {
    component.employeeForm.controls.email.setValue('mukund@gmail.com');
    fixture.detectChanges();
    expect(component.employeeForm.invalid).toBeFalsy();

    //const onSuccessspyOnObj = spyOn(component, 'onSuccess');
    const spy = spyOn(service, 'createEmployee').and.returnValue(
      of(mockEmployee)
    );
    // Trigger the Add Employee function
    component.addEmployee();
    service.createEmployee(mockEmployee).subscribe(res => {
      expect('Success').toEqual(component.message);
      //expect(onSuccessspyOnObj).toHaveBeenCalled();     
      expect(true).toEqual(component.submitted);
    });
    expect(spy).toHaveBeenCalled();
  });

  it('call Error onFailure in createEmployee method Called', () => {
    const res = { Message: 'error_msg' }
    spyOn(service, 'createEmployee').and.returnValue(throwError(res));
    component.onFailure();
    expect('fail').toEqual(component.message);
  });
  //#endregion

  //#endregion Dom Element
  it('employee form invalid when empty', () => {
    component.employeeForm.controls.email.setValue('');
    expect(component.employeeForm.valid).toBeFalsy();

  });

  it('should make email control required', () => {

    const control = component.employeeForm.get('email');
    control.setValue('');
    expect(control.valid).toBe(false);

    // const email = component.employeeForm.controls.email;
    // expect(email.valid).toBeFalsy();

    control.setValue('');
    expect(control.hasError('required')).toBeTruthy();

    control.setValue('mukund@gmail.com');
    expect(control.errors).toBeNull();
  });

  it('should display the Create Employee button', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.innerText).toContain('Create Employee');
  });

  it('should disable the button when email field is empty', () => {
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('#save'));
    expect(button.nativeElement.disabled).toBeTruthy();
  });

  it('should enable button when email field is not empty', () => {
    component.employeeForm.controls.email.setValue('mukund@gmail.com');
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('#save'));
    expect(button.nativeElement.disabled).toBeFalsy();
  });

  it('should return expected from onFailure Method', () => {
    component.onSuccess();
    expect('Success').toEqual(component.message);
  });

  it('should return expected from OnSuccess Method', () => {
    component.onFailure();
    expect('fail').toEqual(component.message);
  });

  it('should render input elements', () => {
    const compiled = fixture.debugElement.nativeElement;
    const nameInput = compiled.querySelector('input[id="name"]');
    const emailInput = compiled.querySelector('input[id="email"]');
    const phoneInput = compiled.querySelector('input[id="phone"]');
    expect(nameInput).toBeTruthy();
    expect(emailInput).toBeTruthy();
    expect(phoneInput).toBeTruthy();
  });
  //#endregion

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
