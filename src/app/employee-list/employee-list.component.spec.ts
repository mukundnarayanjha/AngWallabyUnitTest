import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeListComponent } from './employee-list.component';
import { RestApiService } from '../shared/rest-api.service';
import { HttpClientModule } from '@angular/common/http';
import { Observable, empty, of, from } from 'rxjs';
import { Employee } from '../shared/employee';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('EmployeeListComponent', () => {
  let component: EmployeeListComponent;
  let fixture: ComponentFixture<EmployeeListComponent>;
  let service: RestApiService;
  const mockResponseList: Employee[] = [
    { name: 'Tony Stark1', email: 'tony@mcu.com', phone: 9006487767, id: '1' },
    { name: 'Mukund', email: 'mukund@gmail.com', phone: 9004186606, id: '2' }
  ];
  const mockResponse = { id: '1', name: 'Mukund', email: 'mukund@gmail.com', phone: 9004186606 };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeListComponent],
      imports: [HttpClientModule, RouterTestingModule],
      providers: [RestApiService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    service = new RestApiService(undefined);
    component = new EmployeeListComponent(service);

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  //#region  Component Method
  it('should set employee property with the items returned from the server', () => {
    // Arrange - Setup
    const mockEmployees: Employee[] = [
      { name: 'Tony Stark1', email: 'tony@mcu.com', phone: 9006487767, id: '1' },
      { name: 'Mukund', email: 'mukund@gmail.com', phone: 9004186606, id: '1' }
    ];
    spyOn(service, 'getEmployees').and.returnValue(from([mockEmployees]));
    spyOn(component, 'loadEmployees');
    fixture.detectChanges();

    // Act - Make the actual call
    component.ngOnInit();

    // Assert - Check and report whether the test is pass or fail
    service.getEmployees().subscribe(res => {
      expect(res).toEqual(mockEmployees);
    });
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
  
  it('should call #getEmployeeId', () => {
    spyOn(service, 'getEmployee').and.returnValue(
      of(mockResponse)
    );
    
    component.getEmployeeId(1);

    service.getEmployee(1).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
  });

  it('should call the server to delete a employee if the user confirms', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const spy = spyOn(service, 'deleteEmployee').and.returnValue(
      empty()
    );
    const id = 1;
    component.deleteEmployee(id);
    // component.loadEmployees();
    expect(spy).toHaveBeenCalledWith(id);

  });

  it('should NOT call the server to delete a employee if the user cancels', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    const spy = spyOn(service, 'deleteEmployee').and.returnValue(
      empty()
    );
    const id = 1;
    component.deleteEmployee(id);

    expect(spy).not.toHaveBeenCalledWith(id);
    // expect(component.loadEmployees).toHaveBeenCalled();
  });
  //#endregion

  //#region  Dom Element
  // it('should create one tr for each employee', () => {
  //   const mockEmployees: Employee[] = [
  //     { name: 'Tony Stark1', email: 'tony@mcu.com', phone: 9006487767, id: '1' },
  //     { name: 'Mukund', email: 'mukund@gmail.com', phone: 9004186606, id: '1' }
  //   ];
  //   component.ngOnInit();
  //   spyOn(service, 'getEmployees').and.returnValue(of(mockEmployees));
  //   fixture.detectChanges();
  //   expect(fixture.debugElement.queryAll(By.css('tr')).length).toBe(2);
  // });
  //#endregion


});
