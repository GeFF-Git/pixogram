import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form !: FormGroup;
  bool : boolean = false;
  index : number = 0;
  intervalId : unknown;
  isLoading : boolean = true;

  constructor( private router : Router, private fb: FormBuilder, private authService : AuthService){}
  ngOnInit(): void {
    this.form = new FormGroup({
      'email': new FormControl(null,{validators:[Validators.required,Validators.email],updateOn: "blur"}),
      'password': new FormControl(null,{validators:[Validators.required],updateOn: 'blur'}),
    });

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
    this.authService.login(email,password).subscribe({
      next:(resp) => {
        console.log(resp);
      },
      error:(err) => {
        console.log(err);
      }
    }); 
    }

}
