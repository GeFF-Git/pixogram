import { Component } from '@angular/core';
import { PostModel } from './posts/post.model'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pixogram';
  posts : PostModel[] = [];

  onPostAdded(post : PostModel){
    this.posts.push(post);
    console.log(post.content+ "content");
    console.log(post.title+ "title");

  }
}
