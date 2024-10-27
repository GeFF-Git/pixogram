import { Inject, Injectable } from '@angular/core';
import { PostModel } from './post.model';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Route, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + "/posts";
@Injectable({ providedIn: 'root' })
export class PostService {
  constructor(private httpClient: HttpClient, private router : Router) {}
  private posts: PostModel[] = [];
  emptyPost : PostModel = {id: '', title: '', content: '', imagePath: '', creator: ''};
  editPost !: PostModel;
  // private postObs : Observable<PostModel[]> = of([]);
  // private post!:PostModel

  private postsUpdated = new Subject<{posts: PostModel[], postCount: number}>();

  // getPosts() : Observable<PostModel[]>{
  //   // Arrays are reference types in js,ts, angular
  //   console.log(...this.posts);

  //   // return of([...this.posts]); // =>It creates the copy of the posts: PostModel[] array and adds it to a mew array
  //   return of(this.posts)
  // }

  getPosts(postsPerPage : number, currentPage : number) {
    // Arrays are reference types in js,ts, angular
    // console.log(...this.posts);

    // return [...this.posts]; // =>It creates the copy of the posts: PostModel[] array and adds it to a mew array
    // return this.posts

    const query = `?pagesize=${postsPerPage}&page=${currentPage}`;

    this.httpClient
      .get<{ message: string; posts: {title: string, content: string, _id: string, imagePath: string, creator : string}[], maxPosts: number }>(
        `${BACKEND_URL}${query}`
      )
      .pipe(map((postData)=>{
        return {posts:  postData.posts.map((post)=>{
          // const postReceived : PostModel = 
          return {
            title : post.title,
            content : post.content,
            id : post._id,
            imagePath : post.imagePath,
            creator : post.creator
          };
          // return postReceived;
        }), maxPosts: postData.maxPosts}
      }))
      .subscribe({
        next: (data) => {
          console.log(data);
          this.posts = data.posts;
          this.postsUpdated.next({posts: [...this.posts], postCount: data.maxPosts});
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
    return this.httpClient.get<{id: string, title: string, content: string, imagePath: string, creator: string}>(`${BACKEND_URL}/${postId}`);
  }

  updatePost(post : PostModel,id :string, image : File | string){
    const locPost  = {id: post.id, title: post.title, content: post.content, imagePath: ''};
    let postData : FormData | PostModel;
    if (typeof(image) === 'object' && post.title && post.content) {
      postData = new FormData();
      postData.append("title",post.title);
      postData.append("content",post.content);
      postData.append("image",image,post.title);
    }
    else{
      postData = {id: post.id, title: post.title, content: post.content, imagePath: post.imagePath, creator: post.creator};
    }
    // const id = post.id;
    this.httpClient.put(`${BACKEND_URL}/${id}`,postData)
    .subscribe({
      next:(resp)=>{
        console.log(resp);      
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p=> p.id === id); 
        const respPost : PostModel = {
          id: post.id,
          title: post.title,
          content: post.content,
          imagePath: post.imagePath,
          creator: ''
        }
        // locPost.imagePath = resp.imagePath;
        // updatedPosts[oldPostIndex] = locPost;
        // this.posts = updatedPosts;
        // this.postsUpdated.next([...this.posts]); 
        this.router.navigate(['../']);
      },
      error:(err)=>{
        console.log(err);        
      }
    });
  }

  addPost(post: PostModel, image :File) {
    console.log('addPostTitle' + post.title);
    console.log('addPostContent' + post.content);

    // const postForm : PostModel = {title: post.title, content: post.content}
    const postForm = new FormData();
    if (post.title && post.content) {
      postForm.append("title",post.title);
      postForm.append("content",post.content);
      postForm.append("image",image,image.name);
    }
    this.httpClient
      .post<{ message: string, postData: PostModel }>(BACKEND_URL, postForm)
      .subscribe({
        next: (data) => {
          // console.log(data.message);
          // console.log(data.postData);          
          // post.id = data.postId
          // this.posts.push(post);
          // this.postsUpdated.next([...this.posts]);  next() is similar to emit() method
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
    return this.httpClient.delete<{message: string, postId : string}>(`${BACKEND_URL}/${post}`)
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
