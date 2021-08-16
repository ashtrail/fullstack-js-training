import { Component, OnInit } from '@angular/core'
import { User } from '../user'
import { UsersService } from '../users.service'

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  users: Array<User> = []

  constructor(private heroService: UsersService) {}

  ngOnInit(): void {
    this.heroService.getUsers().then((users) => {
      this.users = users
      console.log('users = ', this.users)
    })
  }

  authorText(user: User): string {
    return user.posts && user.posts.length > 0 ? '(author)' : ''
  }
}
