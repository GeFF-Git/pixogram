import { Inject, Injectable } from '@angular/core';
import { PostModel } from './post.model';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Route, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostService {
  constructor(private httpClient: HttpClient, private router : Router) {}
  private posts: PostModel[] = [];
  emptyPost : PostModel = {id: '', title: '', content: ''};
  editPost !: PostModel;
  // private postObs : Observable<PostModel[]> = of([]);
  // private post!:PostModel

  private postsUpdated = new Subject<PostModel[]>();

  // getPosts() : Observable<PostModel[]>{
  //   // Arrays are reference types in js,ts, angular
  //   console.log(...this.posts);

  //   // return of([...this.posts]); // =>It creates the copy of the posts: PostModel[] array and adds it to a mew array
  //   return of(this.posts)
  // }

  getPosts() {
    // Arrays are reference types in js,ts, angular
    // console.log(...this.posts);

    // return [...this.posts]; // =>It creates the copy of the posts: PostModel[] array and adds it to a mew array
    // return this.posts

    this.httpClient
      .get<{ message: string; posts: {title: string, content: string, _id: string}[] }>(
        'http://localhost:3000/api/posts'
      )
      .pipe(map((postData)=>{
        return postData.posts.map((post)=>{
          const postReceived : PostModel = {
            title: post.title,
            content: post.content,
            id: post._id
          };
          return postReceived;
        })
      }))
      .subscribe({
        next: (data) => {
          console.log(data);
          this.posts = data;
          this.postsUpdated.next([...this.posts]);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  getPostsUpdateListener() {
    return this.postsUpdated.asObservable(); // Other components can only listen(subscribe) and get values but can't emit(add) new values
  }

  getPost( postId : string){
    // this.httpClient.get<{message: string, post : PostModel}>(`https://localhost:3000/api/posts/${postId}`);
    // return {...this.posts.find(p=> p.id == postId )}
    // return {...this.emptyPost};
    return this.httpClient.get<{id: string, title: string, content: string}>(`http://localhost:3000/api/posts/${postId}`);
  }

  updatePost(post : PostModel,id :string){
    const locPost  = {id: post.id, title: post.title, content: post.content};
    // const id = post.id;
    this.httpClient.put(`http://localhost:3000/api/posts/${id}`,locPost)
    .subscribe({
      next:(resp)=>{
        console.log(resp);      
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p=> p.id === id); 
        updatedPosts[oldPostIndex] = locPost;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]); 
        this.router.navigate(['../']);
      },
      error:(err)=>{
        console.log(err);        
      }
    });
  }

  addPost(post: PostModel) {
    console.log('addPostTitle' + post.title);
    console.log('addPostContent' + post.content);

    // const postForm : PostModel = {title: post.title, content: post.content}

    this.httpClient
      .post<{ message: string, postId : string }>('http://localhost:3000/api/posts', post)
      .subscribe({
        next: (data) => {
          console.log(data.message);
          post.id = data.postId
          this.posts.push(post);
          this.postsUpdated.next([...this.posts]); // next() is similar to emit() method
          this.router.navigate(['../']);
        },
        error: (err) => {
          console.log(err);
        },
      });

    // this.posts.push(post);
    // this.postsUpdated.next([...this.posts]);
  }

  deletePost(id : any, post : string) : Observable<{message : string}>{
    return this.httpClient.delete<{message: string, postId : string}>(`http://localhost:3000/api/posts/${post}`)
    // .subscribe({
    //   next:(resp)=>{
    //     console.log(resp);
    //    }
    // }); 
  }

  // deletePost(id : any, post : string){
  //   this.httpClient.delete<{message: string}>(`http://localhost:3000/api/posts/${post}`)
  //   .subscribe({
  //     next:(resp)=>{
  //       console.log(resp);
  //       this.posts = this.posts.filter(p=>p.id!=post);
  //       this.postsUpdated.next([...this.posts])
  //      }
  //   }); 
  // }
}
