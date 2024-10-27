import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from './error/error/error.component';
import * as e from 'express';

// Remove the @injectable decorator and constructor in the intereptor if you are not 
// injecting any service in the interceptor.

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private dialog : MatDialog) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(catchError((err : HttpErrorResponse) => {
      console.log(err);
      let errorMsg = "An unknown error occured!";
      if (err.error.message) {
        errorMsg = err.error.message;
      }
      else if (err.error.error.message) {
        errorMsg = err.error.error.message;
      }
      this.dialog.open(ErrorComponent, {data: {message: errorMsg}, panelClass: 'error-mat-dialog'});
      return throwError(() => err);
    }));
  }
}
