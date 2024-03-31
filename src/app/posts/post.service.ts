import { Inject, Injectable } from "@angular/core";
import { PostModel } from "./post.model";
import { Observable, of,Subject } from "rxjs";


@Injectable({providedIn: 'root'})
export class PostService{
  private posts: PostModel[] = [];
  // private postObs : Observable<PostModel[]> = of([]);
  // private post!:PostModel

  private postsUpdated = new Subject<PostModel[]>();

  getPosts() : Observable<PostModel[]>{
    // Arrays are reference types in js,ts, angular
    console.log(...this.posts);

    // return of([...this.posts]); // =>It creates the copy of the posts: PostModel[] array and adds it to a mew array
    return of(this.posts)
  }

  // getPosts(){
  //   // Arrays are reference types in js,ts, angular
  //   console.log(...this.posts);

  //   // return [...this.posts]; // =>It creates the copy of the posts: PostModel[] array and adds it to a mew array
  //   return this.posts
  // }

  getPostsUpdateListener(){
    return this.postsUpdated.asObservable(); // Other components can only listen(subscribe) and get values but can't emit(add) new values
  }

  addPost(post:PostModel){
    console.log("addPostTitle"+post.title);
    console.log("addPostContent"+post.content);

    // const postForm : PostModel = {title: post.title, content: post.content}

    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
  }
}
