import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { BlogComponent } from './blog/blog.component'

@NgModule({
  declarations: [BlogComponent],
  imports: [CommonModule, RouterModule],
})
export class BlogPostsModule {}
