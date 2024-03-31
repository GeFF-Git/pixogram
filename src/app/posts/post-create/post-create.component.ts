import { Component,EventEmitter,Output } from "@angular/core";
import { PostModel } from '../post.model'
import { NgForm } from "@angular/forms";
import { PostService } from "../post.service";
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']

})

export class PostCreateComponent{

  // dispVar : string = 'NO CONTENT'
  // newVal : string = 'two way binding'

  enteredTitle : string = '';
  enteredContent : string = '';
  posts !: PostModel

  // Each time replaced the existing value in the app-component whenever
  // new post added if it is initialized outside the method
  // Maybe it is because we are passing the reference,
  // and it exactly replacing the references(address) of the previous one
  postNew :PostModel={
    title: '',
    content: ''
  }
  // @Output() postCreated = new EventEmitter();
  // public keyword will automatically create a property in this component and store the incoming value in this property
  constructor(public postService : PostService){}


  onAddPost(form : NgForm){
    // alert('post added successfully')
    // console.log(postInput);
    // console.debug(postInput.value)
    // console.dir(postInput) // Contains all the properties this particular js obj has
      //  this.dispVar = this.newVal
      if(form.invalid){
        // alert('Enter all the fields to submit the form')
        return;
      }

      this.posts = {
        title: form.value.title,
        content: form.value.content
      }
      //this.posts.title = this.enteredTitle;
      console.log(this.posts.title);
      //this.posts.content = this.enteredContent;
      console.log(this.posts.content);

      this.postService.addPost(this.posts);
      form.resetForm();

      // this.postCreated.emit(this.posts);
  }




}
