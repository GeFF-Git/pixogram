import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit,OnDestroy {
  form !: FormGroup;
  bool : boolean = false;
  index : number = 0;
  intervalId : unknown;
  isLoading : boolean = true;
  destroy$ = new Subject();

  constructor( private router : Router, private fb: FormBuilder, private authService : AuthService){}

  ngOnInit(): void {
    this.form = new FormGroup({
      'email': new FormControl(null,{validators:[Validators.required,Validators.email], updateOn: "blur"}),
      'password': new FormControl(null,{validators:[Validators.required], updateOn: 'blur'}),
    });

    this.authService.getAuthStatusListener.pipe(takeUntil(this.destroy$))
    .subscribe({
      next:(authStatus) => {
        this.isLoading = authStatus;
      }
    })
    if (this.index === 0) {
      this.bool = false;
    }
    this.isLoading = false;

    // this.intervalId = setInterval(()=>this.showPopUp(),120000);
    // this.dataService.getUser();
  }

  onLogin(){
    if (this.form.invalid) {
      return;
    }
    console.log(this.form.get('email')?.value);  
    const email = this.form.get('email')?.value;
    const password = this.form.get('password')?.value;
    this.isLoading = true;
    this.authService.login(email,password); 
    }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
