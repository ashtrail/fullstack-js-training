import { Component, OnInit } from '@angular/core'
import { User } from '../user'
import { UsersService } from '../users.service'

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  users: Array<User> = []

  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    this.userService.getUsers().then((users) => {
      this.users = users
    })
  }

  authorText(user: User): string {
    return user.posts && user.posts.length > 0 ? '(author)' : ''
  }

  createUser(newUser: User): void {
    this.userService.createUser(newUser)
    this.userService.getUsers().then((users) => {
      this.users = users
    })
  }
}
