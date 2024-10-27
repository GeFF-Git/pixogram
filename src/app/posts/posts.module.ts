import { NgModule } from "@angular/core";
import { PostListComponent } from "./post-list/post-list.component";
import { PostCreateComponent } from "./post-create/post-create.component";
import { MaterialModule } from "../material.module";
import { ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from "../app-routing.module";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [PostListComponent, PostCreateComponent],
    imports: [MaterialModule, ReactiveFormsModule, AppRoutingModule, CommonModule],
})
export class PostsModule {

}