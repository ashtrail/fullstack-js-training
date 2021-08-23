import { Component, OnInit } from '@angular/core'
import { BlogPost } from '../blog-post'
import { BlogPostService } from '../blog-posts.service'

@Component({
  selector: 'blog',
  templateUrl: './blog.component.html',
  styleUrls: [],
})
export class BlogComponent implements OnInit {
  posts: Array<BlogPost> = []

  constructor(private postService: BlogPostService) {}

  ngOnInit(): void {
    this.postService.getUsers().then((posts) => {
      this.posts = posts
    })
  }
}
