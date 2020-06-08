import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RestApiService } from './rest-api.service';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
    public token: string;
    constructor(private service: RestApiService) {
    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.token = 'mySecretToken';
        req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + this.token) });

        if (!req.headers.has('Content-Type')) {
            req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
        }

        req = req.clone({ headers: req.headers.set('Accept', 'application/json') });

        return next.handle(req);
    }
}
