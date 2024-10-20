import { Component, OnInit } from '@angular/core';
import { PostModel } from './posts/post.model'
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private authService : AuthService) {}
  ngOnInit(): void {
    this.authService.autoAuthUser();
  }
  title = 'pixogram';
  posts : PostModel[] = [];

  onPostAdded(post : PostModel){
    this.posts.push(post);
    console.log(post.content+ "content");
    console.log(post.title+ "title");

  }
}
