import { Component, OnInit } from '@angular/core'
import { User } from '../user'
import { UsersService } from '../users.service'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: [],
})
export class UserComponent implements OnInit {
  inEditMode = false
  loaded = false
  exists = true
  user: User = {
    id: null,
    name: '',
    posts: [],
  }

  constructor(
    private userService: UsersService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = parseInt(params['id'])
      this.fetchUser(id)
    })
  }

  fetchUser(id: number) {
    this.userService
      .getUserById(id)
      .then((user) => {
        this.user = user
        this.loaded = true
        this.exists = true
      })
      .catch((_err) => {
        this.loaded = true
        this.exists = false
      })
  }

  setEditMode(value: boolean): void {
    this.inEditMode = value
  }

  editUser(editedUser: User): void {
    this.userService.updateUser(editedUser).then((_user) => {
      if (this.user.id) this.fetchUser(this.user.id)
    })
  }

  deleteUser(): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(this.user)
      this.router.navigate(['/users'])
    }
  }
}
