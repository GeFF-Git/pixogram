import { Inject, Injectable } from "@angular/core";
import { PostModel } from "./post.model";
import { Observable, of,Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";



@Injectable({providedIn: 'root'})
export class PostService{
  constructor(private httpClient : HttpClient){}
  private posts: PostModel[] = [];
  // private postObs : Observable<PostModel[]> = of([]);
  // private post!:PostModel

  private postsUpdated = new Subject<PostModel[]>();

  // getPosts() : Observable<PostModel[]>{
  //   // Arrays are reference types in js,ts, angular
  //   console.log(...this.posts);

  //   // return of([...this.posts]); // =>It creates the copy of the posts: PostModel[] array and adds it to a mew array
  //   return of(this.posts)
  // }

  getPosts(){
    // Arrays are reference types in js,ts, angular
    // console.log(...this.posts);

    // return [...this.posts]; // =>It creates the copy of the posts: PostModel[] array and adds it to a mew array
    // return this.posts

    this.httpClient.get<{message: string, posts: PostModel[]}>('http://localhost:3000/api/posts').subscribe({
      next:(data)=>{
        console.log(data);
        this.posts = data.posts;
        this.postsUpdated.next([...this.posts]);
      },
      error:(err)=>{
        console.log(err);

      }
    });
  }

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
