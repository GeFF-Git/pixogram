import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit,OnDestroy{
  constructor(public authService : AuthService){}
  userIAuthenticated : boolean = false;
  private authListenerSubscription !: Subscription;

  ngOnInit(): void {
    this.userIAuthenticated = this.authService.getIsAuth;
    this.authListenerSubscription = this.authService.getAuthStatusListener.subscribe({
      next:(isAuthenticated) => {
        this.userIAuthenticated = isAuthenticated;
      },
      error:(err) => {
        console.log(err);
      }
    });
  }
  onLogout(){
    this.authService.onLogout();
  }

  ngOnDestroy(): void {
    this.authListenerSubscription.unsubscribe();
  }
}
