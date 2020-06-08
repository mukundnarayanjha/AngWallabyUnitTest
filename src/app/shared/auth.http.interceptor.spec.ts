import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RestApiService } from './rest-api.service';
import { AuthHttpInterceptor } from './auth.http.interceptor';

describe(`AuthHttpInterceptor`, () => {
  let service: RestApiService;
  let httpMock: HttpTestingController;
  const token = 'mySecretToken';
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RestApiService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthHttpInterceptor,
          multi: true,
        },
      ],
    });

    service = TestBed.get(RestApiService);
    httpMock = TestBed.get(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify(); // Verifies that no requests are outstanding.
  });

  // Observables don’t fire unless we subscribe to them, so by subscribing to the getEmployees function
  // we’re sending a HTTP GET request. As we’re not concerned with the results of the request
  // (i.e. whether it correctly returned employees) we can simply check that the request happened.

  describe('intercept HTTP requests', () => {

    it('has Authorization header', () => {
      service.getEmployees().subscribe(response => {
        expect(response).toBeTruthy();
      });
      const req = httpMock.expectOne(service.apiURL);
      expect(req.request.headers.has('Authorization')).toEqual(true);
      expect(req.request.headers.get('Authorization')).toEqual(`Bearer ${token}`);

    });

    it('should add content-type and accept property in http header', () => {
      service.getEmployees().subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(service.apiURL);
      // here we check httpRequest’s request.headers object contains a header with the names of ‘Accept’ and ‘Content-Type’
      expect(req.request.headers.has('Content-Type')).toEqual(true);
      expect(req.request.headers.has('Accept')).toEqual(true);

      // here we check whether included ‘Accept’ and ‘Content-Type’ header contains the values we expect.
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      expect(req.request.headers.get('Accept')).toBe('application/json');
    });
  });
});
