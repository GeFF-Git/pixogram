import { Component,Input, OnDestroy, OnInit, Output } from "@angular/core";
import { PostModel } from './../post.model'
import { MatDialog,MatDialogRef,MatDialogActions,MatDialogClose,MatDialogTitle,MatDialogContent } from "@angular/material/dialog";
import { MatButtonModule } from '@angular/material/button'
import {MatDialogModule} from '@angular/material/dialog';
import { PostService } from "../post.service";
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})

export class PostListComponent implements OnInit,OnDestroy{

  // { title: 'First post', content: 'Godzilla x Kong' },
  // { title: 'Second post', content: 'Godzilla vs Kong' },
  // { title: 'Third post', content: 'Kong: skull island' }
  constructor(public matDialog : MatDialog, public postService : PostService){}
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.postsSubscription.unsubscribe();
  }
  postsVar : PostModel[] = [];
  private postsSubscription !: Subscription;
  // ngOnInit(): void {
  //   // throw new Error("Method not implemented.");
  //   this.postService.getPosts().subscribe({
  //     next:(value:PostModel[])=>{
  //       console.log(value);
  //       this.postsVar = value;
  //       console.log(this.postsVar);
  //     },
  //     error:(err)=>{
  //       console.log(err);
  //     }
  //   })
  //   // this.postsVar = this.postService.getPosts();
  // }

  ngOnInit(): void {
    this.postService.getPosts();
      this.postsSubscription = this.postService.getPostsUpdateListener().subscribe({
        next:(data : PostModel[])=>{
          console.log(data);
          this.postsVar = data
        },
        error:(err)=>{
          console.log(err);
        }
      })
  }



  // @Input() postsVar !: PostModel[]


  deleteRow(index : any, post: PostModel, enterAnimationDuration: string, exitAnimationDuration : string){
    const val = this.postsVar.findIndex(p=>p.id == post.id);
    // this.matDialog.open(DialogAnimationsExampleDialog,confirm(){
    //   width: '250px',
    //   enterAnimationDuration,
    //   exitAnimationDuration
    // })

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
          this.postsVar.find(p=>p.id==post.id);
        }
      });
      
    }
    this.postsVar.splice(val);
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
  @Output() bool : boolean = false

}
