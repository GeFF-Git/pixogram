import { Component,Input, Output } from "@angular/core";
import { PostModel } from './../post.model'
import { MatDialog,MatDialogRef,MatDialogActions,MatDialogClose,MatDialogTitle,MatDialogContent } from "@angular/material/dialog";
import { MatButtonModule } from '@angular/material/button'
import {MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})

export class PostListComponent{

  // { title: 'First post', content: 'Godzilla x Kong' },
  // { title: 'Second post', content: 'Godzilla vs Kong' },
  // { title: 'Third post', content: 'Kong: skull island' }
  constructor(public matDialog : MatDialog){}

  @Input() postsVar !: PostModel[]

  deleteRow(index : any, enterAnimationDuration: string, exitAnimationDuration : string){
    const val = this.postsVar.findIndex(p=>index==p);
    // this.matDialog.open(DialogAnimationsExampleDialog,confirm(){
    //   width: '250px',
    //   enterAnimationDuration,
    //   exitAnimationDuration
    // })
    const a = confirm('Are you sure to delete')
    if (a) {
      this.postsVar.splice(val);
    }
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
