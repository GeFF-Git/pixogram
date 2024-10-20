import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';
import { BehaviorSubject, TimeoutConfig } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token !: string;
  private isAuth !: boolean;
  private tokenTimeout !: NodeJS.Timeout;
  private authStatusListener : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private httpClient : HttpClient, private router : Router) { }

  get getToken(){
    return this.token;
  }

  get getIsAuth(){
    return this.isAuth;
  }

  get getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  createUser(email : string, password : string){
    const user : AuthData = { email : email, password : password}
    return this.httpClient.post('http://localhost:3000/api/user/signup',user);
  }

  login(email : string, password : string){
    const user : AuthData = { email : email, password : password}
    this.httpClient.post<{token : string, expiresIn : number}>('http://localhost:3000/api/user/login',user).subscribe({
      next:(resp) => {
        console.log(resp);
        const token = resp.token;
        this.token = token;
        if (token) {
          const expiresIn = resp.expiresIn;
          this.setAuthTimeout(expiresIn);
          this.isAuth = true;
          this.authStatusListener.next(true);
          const date = new Date();
          const expirationDate = new Date(date.getTime() + expiresIn * 1000);
          this.saveAuthData(token, expirationDate);
          this.router.navigate(['/']);
        }
      },
      error:(err) => {
        console.log(err);
      }
    });;
  }

  onLogout(){
    this.token = '';
    this.isAuth = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimeout);
    this.clearAuthData();
    this.router.navigate(['/']);
    // this.authStatusListener.complete();
  }

  private setAuthTimeout(duration : number) {
    this.tokenTimeout = setTimeout(() => {
      this.onLogout();
    }, duration * 1000);
  }

  autoAuthUser() {
    const authData = this.getAuthData();
    const now = new Date();
    if (!authData?.expirationDate) {
      return;
    }
    const expiresIn = new Date(authData!.expirationDate).getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authData?.token;
      this.isAuth = true;
      this.setAuthTimeout(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private saveAuthData(token : string, expirationDate : Date){
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('expirationDate', expirationDate.toISOString());
  }

  private getAuthData() {
    const token = sessionStorage.getItem("token");
    const expirationDate = sessionStorage.getItem("expirationDate");
    if (!(token && expirationDate)) {
      return;
    }
    return {
      token : token,
      expirationDate : expirationDate
    }
  }

  private clearAuthData() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('expirationDate');
  }
}
