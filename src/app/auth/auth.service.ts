import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';
import { BehaviorSubject, TimeoutConfig } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + "/user"
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token !: string;
  private isAuth !: boolean;
  private tokenTimeout !: NodeJS.Timeout;
  private authStatusListener : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private userId !: string;

  constructor(private httpClient : HttpClient, private router : Router) { }

  get getToken(){
    return this.token;
  }

  get getIsAuth(){
    return this.isAuth;
  }

  get getUserId() {
    return this.userId;
  }

  get getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  createUser(email : string, password : string){
    const user : AuthData = { email : email, password : password}
    this.httpClient.post(BACKEND_URL + '/signup',user)
        .subscribe({
      next:(resp) => {
        this.router.navigate(['/']);
      },
      error:(err) => {
        console.log(err);
        this.authStatusListener.next(false);
      }
    })  ;
  }

  login(email : string, password : string){
    const user : AuthData = { email : email, password : password}
    this.httpClient.post<{token : string, expiresIn : number, userId : string}>(BACKEND_URL + '/login',user).subscribe({
      next:(resp) => {
        console.log(resp);
        const token = resp.token;
        this.token = token;
        if (token) {
          const expiresIn = resp.expiresIn;
          this.userId = resp.userId;
          this.setAuthTimeout(expiresIn);
          this.isAuth = true;
          this.authStatusListener.next(true);
          const date = new Date();
          const expirationDate = new Date(date.getTime() + expiresIn * 1000);
          this.saveAuthData(token, expirationDate, this.userId);
          this.router.navigate(['/']);
        }
      },
      error:(err) => {
        console.log(err);
        this.authStatusListener.next(false);
      }
    });;
  }

  onLogout(){
    this.token = '';
    this.isAuth = false;
    this.userId = '';
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
      this.userId = authData.userId ?? '';
      this.setAuthTimeout(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private saveAuthData(token : string, expirationDate : Date, userId : string){
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('expirationDate', expirationDate.toISOString());
    sessionStorage.setItem('userId', userId);
  }

  private getAuthData() {
    const token = sessionStorage.getItem("token");
    const expirationDate = sessionStorage.getItem("expirationDate");
    const userId = sessionStorage.getItem("userId");
    if (!(token && expirationDate)) {
      return;
    }
    return {
      token : token,
      expirationDate : expirationDate,
      userId : userId
    }
  }

  private clearAuthData() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('expirationDate');
    sessionStorage.removeItem('userId');
  }
}
