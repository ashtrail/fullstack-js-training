import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { NavBarComponent } from './nav-bar/nav-bar.component'
import { UsersModule } from './users/users.module'
import { BlogPostsModule } from './blog-posts/blog-posts.module'

@NgModule({
  declarations: [AppComponent, NavBarComponent],
  imports: [BrowserModule, AppRoutingModule, UsersModule, BlogPostsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
