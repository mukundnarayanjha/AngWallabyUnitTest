import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeComponent } from './employee.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { RestApiService } from '../shared/rest-api.service';
import { Employee } from '../shared/employee';
import { of, from, empty, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TextColorDirective } from '../shared/directives/text-color.directive';

describe('EmployeeComponent', () => {
  let component: EmployeeComponent;
  let fixture: ComponentFixture<EmployeeComponent>;
  let service: RestApiService;

  const mockResponseList: Employee[] = [
    { name: 'Tony Stark1', email: 'tony@mcu.com', phone: 9006487767, id: '1' },
    { name: 'Mukund', email: 'mukund@gmail.com', phone: 9004186606, id: '2' }
  ];
  const mockResponse = { id: '1', name: 'Mukund', email: 'mukund@gmail.com', phone: 9004186606 };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeComponent, TextColorDirective],
      imports: [ReactiveFormsModule, HttpClientModule, RouterTestingModule],
      providers: [RestApiService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    service = TestBed.get(RestApiService);
  });
  //#region Component Method

  it('has called all method which is inside ngOnInit', () => {
    const loadEmployeesspyOnObj = spyOn(component, 'loadEmployees');
    const loadEUOspyOnObj = spyOn(component, 'loadUnderObservationEmployees');
    component.ngOnInit();
    expect(loadEmployeesspyOnObj).toHaveBeenCalled();
    expect(loadEUOspyOnObj).toHaveBeenCalled();
  });

  it('#loadEmployees method should return expected employee', () => {
    spyOn(service, 'getEmployees').and.returnValue(from([mockResponseList]));

    // Act - Make the actual call
    component.ngOnInit();

    // Assert - Check and report whether the test is pass or fail
    service.getEmployees().subscribe(res => {
      expect(res).toEqual(mockResponseList);
      expect(res.length).toEqual(2);
    });
  });

  it('#loadUnderObservationEmployees method should return expected employee', () => {
    spyOn(service, 'getAllUnderObservationEmployees').and.returnValue(from([mockResponseList]));

    // Act - Make the actual call
    component.ngOnInit();

    // Assert - Check and report whether the test is pass or fail
    service.getAllUnderObservationEmployees().subscribe(res => {
      expect(res).toEqual(mockResponseList);
      expect(res.length).toEqual(2);
    });
  });
  it('should call #getEmployeeId', () => {
    spyOn(service, 'getEmployee').and.returnValue(
      of(mockResponse)
    );
    // const employeeFormSpyOn = spyOn(component, 'fillRecordInEmployeeForm');

    component.getEmployeeId(1);

    service.getEmployee(1).subscribe(res => {
      expect(res).toEqual(mockResponse);
      // expect(employeeFormSpyOn).toBeTruthy();
      expect(component.ShowAddPerson).toEqual(true);
      expect(component.Disabled).toEqual(true);
    });
  });

  it('should call #getUnderObservationEmployeeId', () => {
    spyOn(service, 'getUnderObservationEmployee').and.returnValue(
      of(mockResponse)
    );
    // const employeeFormSpyOn = spyOn(component, 'fillRecordInEmployeeForm');

    component.getUnderObservationEmployeeId(1);

    service.getUnderObservationEmployee(1).subscribe(res => {
      expect(res).toEqual(mockResponse);
      // expect(employeeFormSpyOn).toBeTruthy();
      expect(false).toEqual(component.ShowAddPerson);
      expect(true).toEqual(component.Disabled);
    });
  });

  it('should Add EUO Employee when EUOSaveButtonClick button Click', () => {
    spyOn(service, 'createUnderObservationEmployee').and.returnValue(
      of(mockResponse)
    );
    // const onSuccessspyOnObj = spyOn(component, 'onSuccess');
    const loadEUOspyOnObj = spyOn(component, 'loadUnderObservationEmployees');

    // Trigger the EUOSaveButtonClick function
    component.EUOSaveButtonClick();

    service.createUnderObservationEmployee(mockResponse).subscribe(res => {
      expect(res).toEqual(mockResponse);
      // expect(onSuccessspyOnObj).toHaveBeenCalled();
      expect(loadEUOspyOnObj).toHaveBeenCalled();
      expect(true).toEqual(component.submitted);
      expect('Success').toEqual(component.message);
    });
  });

  it('should call the server to remove EUO Employee if the user confirms', () => {

    component.employeeForm.controls.id.setValue('1');
    const id = component.employeeForm.get('id');
    fixture.detectChanges();

    spyOn(window, 'confirm').and.returnValue(true);
    const spy = spyOn(service, 'deleteUnderObservationEmployee').and.returnValue(
      empty()
    );

    const loadEUOspyOnObj = spyOn(component, 'loadUnderObservationEmployees');
    component.EUORemoveButtonClick();

    service.deleteUnderObservationEmployee(1).subscribe(() => {
      expect(loadEUOspyOnObj).toHaveBeenCalled();
      expect(true).toEqual(component.submitted);
    });
    expect(spy).toHaveBeenCalledWith(1);
    expect(id).not.toBeNull();
  });

  it('should NOT call the server toremove EUO Employee if the user cancels', () => {

    spyOn(window, 'confirm').and.returnValue(false);
    const spy = spyOn(service, 'deleteUnderObservationEmployee').and.returnValue(
      empty()
    );
    component.EUORemoveButtonClick();
    expect(spy).not.toHaveBeenCalledWith(1);
  });

  it('should return expected from onFailure Method', () => {
    component.onSuccess();
    expect('Success').toEqual(component.message);
  });

  it('should return expected from OnSuccess Method', () => {
    component.onFailure();
    expect('fail').toEqual(component.message);
  });

  it('should check for the getPrefixSuffixList error call ', () => {
    spyOn(service, 'createUnderObservationEmployee').and.returnValue(throwError('error'));
    component.EUOSaveButtonClick();
    expect(service.createUnderObservationEmployee).toHaveBeenCalled();
  });

  it('call Error onFailure in createUnderObservationEmployee method', () => {
    const res = { Message: 'error_msg' }
    spyOn(service, 'createUnderObservationEmployee').and.returnValue(throwError(res));
    component.onFailure();
    expect('fail').toEqual(component.message);
  });
  //#endregion

  //#region Dom Element
  it('should set text-color green when Save and Remove EUO', () => {
    const targetElement = fixture.debugElement.query(By.css('#notify'));
    component.submitted = true;
    // fixture.detectChanges();
    expect(targetElement.nativeElement.style.color).toEqual('green');
  });

  it('Setting enabled to false disables the EUOAdd submit button', () => {
    const EUOAddButton = fixture.debugElement.query(By.css('#EUOAdd'));
    component.Disabled = false;
    fixture.detectChanges();
    expect(EUOAddButton.nativeElement.disabled).toBeTruthy();
  });

  it('Setting enabled to true enables the EUOAdd submit button', () => {
    const EUOAddButton = fixture.debugElement.query(By.css('#EUOAdd'));
    component.Disabled = true;
    fixture.detectChanges();
    expect(EUOAddButton.nativeElement.disabled).toBeFalsy();
  });

  it('Checked here the EUORemove button not exists', () => {
    const EUORemoveButton = fixture.debugElement.query(By.css('#EUORemove'));
    expect(EUORemoveButton).toBeNull();
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
