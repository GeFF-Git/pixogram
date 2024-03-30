import { Inject, Injectable } from "@angular/core";
import { PostModel } from "./post.model";

@Injectable({providedIn: 'root'})
export class PostService{
  private posts: PostModel[] = []
  // private post!:PostModel

  getPosts(){
    return [...this.posts]; // =>It creates the copy of the posts: PostModel[] array and adds it to a mew array
  }

  addPost(post:PostModel){
    this.posts.push(post);
  }
}
