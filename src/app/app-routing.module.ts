import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { LoginComponent } from './auth/login/login/login.component';
import { SignupComponent } from './auth/signup/signup/signup.component';

const routes: Routes = [
  {path:'', component: LoginComponent},
  {path:'signup', component: SignupComponent},
  {path: 'create', component: PostCreateComponent},
  {path: 'edit/:postId', component: PostCreateComponent},
  {path:'posts', component: PostListComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
