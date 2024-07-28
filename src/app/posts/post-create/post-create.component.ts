import { Component,EventEmitter,OnInit,Output } from "@angular/core";
import { PostModel } from '../post.model'
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { PostService } from "../post.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { mimeType } from "./mime-type.validator";
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']

})

export class PostCreateComponent implements OnInit{

  // dispVar : string = 'NO CONTENT'
  // newVal : string = 'two way binding'

  enteredTitle : string = '';
  enteredContent : string = '';
  posts !: PostModel;
  private mode : boolean = false;
  private postId !: string;
  post  !: PostModel | undefined;
  private editPost !: PostModel;
  isLoading : boolean = false;
  form !: FormGroup;
  imageUrl !: string;

  // Each time replaced the existing value in the app-component whenever
  // new post added if it is initialized outside the method
  // Maybe it is because we are passing the reference,
  // and it exactly replacing the references(address) of the previous one
  postNew :PostModel={
    title: '',
    content: '',
    imagePath: ''
  };
  // @Output() postCreated = new EventEmitter();
  // public keyword will automatically create a property in this component and store the incoming value in this property
  constructor(public postService : PostService, public route : ActivatedRoute){}
  ngOnInit(): void {
    this.form = new FormGroup({
      'title': new FormControl(null,{validators:[Validators.required, Validators.minLength(3)],updateOn: 'blur'}),
      'content': new FormControl(null,{validators:[Validators.required, Validators.minLength(3) ], updateOn: 'blur'}),
      'image': new FormControl(null,{validators:[Validators.required], asyncValidators: [mimeType]})
    })
    this.route.paramMap.subscribe({
      next:(paramMap : ParamMap)=>{
        if (paramMap.has('postId')) {
          this.postId = paramMap.get('postId') || '';
          // this.post = this.postService.getPost(this.postId);
          this.isLoading = true;
          this.postService.getPost(this.postId).subscribe({
            next:(post : PostModel) =>{
              console.log(post);  
              this.post = post;
              this.form.setValue({
                'title': this.post.title,
                'content': this.post.content,
                'image': this.post.imagePath
              });
              this.mode = true; 
              this.isLoading = false;
            },
            error:(err)=>{
              console.log(err);              
            }
          })
        }
        else{
          this.postId = null || '';
          this.mode =false;
        }
      },
      error:(err)=>{
        console.log(err);        
      }
    });
    }

  // method for angular forms
  // onSavePost(form : NgForm){
  //   // alert('post added successfully')
  //   // console.log(postInput);
  //   // console.debug(postInput.value)
  //   // console.dir(postInput) // Contains all the properties this particular js obj has
  //     //  this.dispVar = this.newVal
  //     if(form.invalid){
  //       // alert('Enter all the fields to submit the form')
  //       return;
  //     }
  //     this.isLoading = true;
  //     this.posts = {
  //       title: form.value.title,
  //       content: form.value.content
  //     }
  //     //this.posts.title = this.enteredTitle;
  //     console.log(this.posts.title);
  //     //this.posts.content = this.enteredContent;
  //     console.log(this.posts.content);
  //     if (this.mode === false) {
  //       this.postService.addPost(this.posts);
  //       form.resetForm();
  //     }
  //     else{
  //       this.postService.updatePost(this.posts,this.postId);
  //     }

  //     // this.postCreated.emit(this.posts);
  // }


  onFileUpload(event : Event){
    const file = (event.target as HTMLInputElement).files?.[0];
    this.form.patchValue({image: file});
    this.form.get('image')?.updateValueAndValidity();
    console.log(file);
    console.log(this.form);  
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;
    };
    reader.readAsDataURL(file as Blob);  
  }

  //Method for reactive forms
  onSavePost(){
      if(this.form.invalid){
        return;
      }
      this.isLoading = true;
      this.posts = {
        title: this.form.value.title,
        content: this.form.value.content,
        imagePath: ''
      }
      console.log(this.posts.title);
      console.log(this.posts.content);
      if (this.mode === false) {
        this.postService.addPost(this.posts,this.form.value.image);
        this.form.reset();
      }
      else{
        this.postService.updatePost(this.posts,this.postId,this.form.value.image);
      }
  }
}
