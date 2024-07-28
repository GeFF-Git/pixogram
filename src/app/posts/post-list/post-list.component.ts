import { Component,Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from "@angular/core";
import { PostModel } from './../post.model'
import { MatDialog,MatDialogRef,MatDialogActions,MatDialogClose,MatDialogTitle,MatDialogContent } from "@angular/material/dialog";
import { MatButtonModule } from '@angular/material/button'
import {MatDialogModule} from '@angular/material/dialog';
import { PostService } from "../post.service";
import { Subscription } from 'rxjs';
import { Router } from "@angular/router";
import { PageEvent } from "@angular/material/paginator";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})

export class PostListComponent implements OnInit,OnDestroy{

  // { title: 'First post', content: 'Godzilla x Kong' },
  // { title: 'Second post', content: 'Godzilla vs Kong' },
  // { title: 'Third post', content: 'Kong: skull island' }
  isLoading :boolean = false;
  constructor(public matDialog : MatDialog, public postService : PostService, private router : Router){}
  currentPage : number = 1;
  totalPosts : number = 0;
  postsPerPage : number = 2;
  postPerOptions : number[] = [1,2,5,10];
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.postsSubscription.unsubscribe();
  }
  postsVar : PostModel[] = [];
  private postsSubscription !: Subscription;

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage,this.currentPage);
      this.postsSubscription = this.postService.getPostsUpdateListener().subscribe({
        next:(data : {posts: PostModel[], postCount: number})=>{
          console.log(data);
          this.postsVar = data.posts;
          this.totalPosts = data.postCount;
          this.isLoading = false;
        },
        error:(err)=>{
          console.log(err);
        }
      });
  }



  // @Input() postsVar !: PostModel[]

  editPost(postId : string | undefined){
    this.isLoading = true;
    this.router.navigate(['/edit',postId])
  }

  onChangePage(pageData : PageEvent){
    console.log(pageData);    
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage,this.currentPage);
  }
  deleteRow(index : any, post: PostModel, enterAnimationDuration: string, exitAnimationDuration : string){
    // const val = this.postsVar.findIndex(p=>p.id == post.id);
    // this.matDialog.open(DialogAnimationsExampleDialog,confirm(){
    //   width: '250px',
    //   enterAnimationDuration,
    //   exitAnimationDuration
    // })
    this.isLoading = true; 
    const a = confirm('Are you sure to delete')
    if (a) {
      this.postService.deletePost(index,post.id||'')     
      .subscribe({
        next:(resp)=>{
          console.log(resp);
          // this.postsVar.forEach(elem=>{
          //   if (elem.id == post.id) {
          //     // this.postsVar.filter(p=>p.id!=post.id)           
          //   }
          // })
          this.postService.getPosts(this.postsPerPage,this.currentPage);
          // this.postsVar =  this.postsVar.filter(p => p.id != post.id);
          this.postService.getPostsUpdateListener().subscribe({
            next:(posts) => {
              this.postsVar = posts.posts;
              this.totalPosts = posts.postCount;
              this.isLoading = false;
            },
            error:(err)=>{
              console.log(err);
            }
          })
        }
      }); 
    }
    else{
      this.isLoading = false;
    }
    // this.postsVar.splice(val);
  }
}
@Component({
  selector: 'dialog-animations-example-dialog',
  templateUrl: 'dialog-animations-example-dialog.html',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
})
export class DialogAnimationsExampleDialog {
  constructor(public dialogRef: MatDialogRef<DialogAnimationsExampleDialog>) {}
  @Output() bool : boolean = false;

}
