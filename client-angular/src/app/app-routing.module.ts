import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { BlogComponent } from './blog-posts/blog/blog.component'
import { UserListComponent } from './users/user-list/user-list.component'
import { UserComponent } from './users/user/user.component'

const routes: Routes = [
  { path: '', component: BlogComponent },
  { path: 'posts', component: BlogComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'users', component: UserListComponent },
  { path: 'users/:id', component: UserComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
