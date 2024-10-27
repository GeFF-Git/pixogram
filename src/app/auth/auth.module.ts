import { NgModule } from "@angular/core";
import { LoginComponent } from "./login/login/login.component";
import { SignupComponent } from "./signup/signup/signup.component";
import { MaterialModule } from "../material.module";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AuthRoutingModule } from "./auth-routing.module";

@NgModule({
    declarations: [
        LoginComponent, 
        SignupComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
        AuthRoutingModule
    ],
})
export class AuthModule {

}