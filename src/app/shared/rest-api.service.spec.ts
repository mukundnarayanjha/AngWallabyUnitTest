import { TestBed } from '@angular/core/testing';
import { RestApiService } from './rest-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule, HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http';

describe('RestApiService', () => {
  let service: RestApiService;
  let httpMock: HttpTestingController;
  let http: HttpClient;
  const mockedFailErrMsg = 'CALL ERROR';

  const mockResponse = [
    { id: '1', name: 'Tony Stark1', email: 'tony@mcu.com', phone: 9006487767 },
    { id: '2', name: 'Mukund', email: 'mukund@gmail.com', phone: 9004186606 }
  ];
  const mockEmployee = { id: '1', name: 'Tony Stark1', email: 'tony@mcu.com', phone: 9006487767 };

  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [RestApiService],
      // providers: [{provide: RestApiService, useClass: RestApiServiceMock}]
    });
    http = TestBed.get(HttpClient);
    // Returns a service with the MockBackend so we can test with dummy responses
    service = TestBed.get(RestApiService);
    // Inject the http service and test controller for each test
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifies that no requests are outstanding.
  });

  //#region for Get Employee Details
  // Test case 1
  it('should return expected employees', () => {

    // act
    service.getEmployees().subscribe(
      emps => {
        expect(emps).toEqual(mockResponse, 'should return expected employees');
        expect(emps).not.toBeNull();
      },
      (error) => { fail(); });

    // We set the expectations for the HttpClient mock
    const req = httpMock.expectOne(service.apiURL);

    // we expect the HTTP method to be GET
    expect(req.request.method).toEqual('GET');

    // Then we set the fake data to be returned by the mock
    // Here we ask the mock to return some fake data with the flush method
    req.flush(mockResponse); // Return expectedEmps
  });

  it('#getEmployees should throw with an error message when API returns an error', () => {
    service.getEmployees().subscribe(
      response => fail('should have failed with 500 status'),
      (error: HttpErrorResponse) => {
        expect(error).toBeTruthy();
        expect(error.status).toEqual(500);
      }
    );

    const req = httpMock.expectOne(service.apiURL);
    expect(req.request.method).toEqual('GET');

    req.flush({ errorMessage: 'Uh oh!' }, { status: 500, statusText: 'Server Error' });
    httpMock.verify();
  });

  //#endregion

  //#region for Get particular Employee Details

  // Test case 1
  it('should return expected employees with an Id = 1', () => {
    const id = 1;
    service.getEmployee(id).subscribe(
      emps => {
        expect(emps).toEqual(mockResponse[1]);
      });

    // Expect a call to this URL
    const req = httpMock.expectOne(`${service.apiURL}/${id}`);
    // Assert that the request is a GET.
    expect(req.request.method).toEqual('GET');
    // Respond with this data when called
    req.flush(mockResponse[1]); // Return expectedEmps
  });

  it('#getEmployee should throw with an error message when API returns an error', () => {
    const id = 1;
    service.getEmployee(id).subscribe(
      response => fail('should have failed with 500 status'),
      (error: HttpErrorResponse) => {
        expect(error).toBeTruthy();
        expect(error.status).toEqual(500);
      }
    );

    const req = httpMock.expectOne(`${service.apiURL}/${id}`);
    expect(req.request.method).toEqual('GET');

    req.flush({ errorMessage: 'Uh oh!' }, { status: 500, statusText: 'Server Error' });
    httpMock.verify();
  });

  //#endregion

  //#region for Create Employee
  // Test case 1
  it('should add an employee and return it', () => {
    service.createEmployee(mockEmployee).subscribe(data => {
      expect(data).toEqual(mockEmployee);
      expect(data.name).toEqual(mockEmployee.name);
    });
    // addEmploye should have made one request to POST employee
    const req = httpMock.expectOne(service.apiURL, JSON.stringify(mockEmployee));
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(mockEmployee);

    // Expect server to return the employee after POST
    const expectedResponse = new HttpResponse({ status: 201, statusText: 'Created', body: mockEmployee });
    req.event(expectedResponse);
  });
  // Test case 2
  it('should throw with an error message when API returns an error', () => {
    service.createEmployee(mockEmployee).subscribe(
      response => fail('should fail with status 500 error'),
      (error: HttpErrorResponse) => {
        expect(error).toBeTruthy();
        expect(error.status).toEqual(500);
      }
    );
    // addEmploye should have made one request to POST employee
    const req = httpMock.expectOne(service.apiURL, JSON.stringify(mockEmployee));
    expect(req.request.method).toEqual('POST');

    // Expect server to return the employee after POST
    req.flush({ errorMessage: 'Uh oh!' }, { status: 500, statusText: 'Server Error' });
  });


  //#endregion

  //#region for Update Employee
  // Test case 1
  it('should update an employee', () => {
    service.updateEmployeeData(mockEmployee.id, mockEmployee).subscribe(
      data => expect(data).toEqual(mockEmployee, 'should return the employee'),
      fail
    );
    // RestApiService should have made one request to PUT employee
    const req = httpMock.expectOne(`${service.apiURL}/${mockEmployee.id}`, JSON.stringify(mockEmployee));
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(mockEmployee);

    // Expect server to return the hero after PUT
    const expectedResponse = new HttpResponse({ status: 200, statusText: 'OK', body: mockEmployee });
    req.event(expectedResponse);
  });

  //#endregion

  //#region for Delete Employee Data
  // Test case 1
  it('should return expected employees by calling once', () => {

    const id = 1;
    // act
    service.deleteEmployee(id).subscribe(
      emps => expect(emps).toEqual(mockResponse, 'should return expected employees'),
      fail
    );
    // http mock
    const req = httpMock.expectOne(`${service.apiURL}/${id}`);
    expect(req.request.method).toEqual('DELETE');

    req.flush(mockResponse); // Return expectedEmps
  });

  //#endregion

  // ###########Region Test case For EUO ###########
  // Test case 1
  it('should return expected employees under observation', () => {

    // act
    service.getAllUnderObservationEmployees().subscribe(
      emps => {
        expect(emps).toEqual(mockResponse, 'should return expected employees');
        expect(emps).not.toBeNull();
      });

    // We set the expectations for the HttpClient mock
    const req = httpMock.expectOne(service.apiURL1);

    // we expect the HTTP method to be GET
    expect(req.request.method).toEqual('GET');

    // Then we set the fake data to be returned by the mock
    // Here we ask the mock to return some fake data with the flush method
    req.flush(mockResponse); // Return expectedEmps
  });

  it('should throw with an error message when API returns an error', () => {
    service.getAllUnderObservationEmployees().subscribe((data) => { }, (errResp) => {
      expect(errResp.status).toEqual(404, 'status');
      expect(errResp.error).toEqual(mockedFailErrMsg, 'message');
    });

    const req = httpMock.expectOne(service.apiURL1);
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toEqual('json');

    req.flush(mockedFailErrMsg, { status: 404, statusText: 'Not Found' });
  });
  // Test case 2
  it('should return expected employees under observation with an Id = 1', () => {
    const id = 1;
    service.getUnderObservationEmployee(id).subscribe(
      emps => {
        expect(emps).toEqual(mockResponse[1]);
      });

    // Expect a call to this URL
    const req = httpMock.expectOne(`${service.apiURL1}/${id}`);
    // Assert that the request is a GET.
    expect(req.request.method).toEqual('GET');
    // Respond with this data when called
    req.flush(mockResponse[1]); // Return expectedEmps
  });
  // Test Case 3
  it('should add an employee under observation and return it', () => {
    service.createUnderObservationEmployee(mockEmployee).subscribe(data => {
      expect(data).toEqual(mockEmployee);
      expect(data.name).toEqual(mockEmployee.name);
    });

    const req = httpMock.expectOne(service.apiURL1, JSON.stringify(mockEmployee));
    expect(req.request.method).toEqual('POST');

    // Expect server to return the employee after POST
    const expectedResponse = new HttpResponse({ status: 201, statusText: 'Created', body: mockEmployee });
    req.event(expectedResponse);
  });

  it('should remove employees under observation list (id=1)', () => {

    const id = 1;
    // act
    service.deleteUnderObservationEmployee(id).subscribe(
      emps => expect(emps).toEqual(mockResponse, 'should return expected employees'),
      fail
    );
    // http mock
    const req = httpMock.expectOne(`${service.apiURL1}/${id}`);
    expect(req.request.method).toEqual('DELETE');

    req.flush(mockResponse); // Return expectedEmps
  });

  //#endregion
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});

