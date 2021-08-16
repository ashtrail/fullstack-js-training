import { Injectable } from '@angular/core'
import http from '../../../src/http-common'
import { User } from './user'

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor() {}

  async getUsers(): Promise<User[]> {
    const res = await http.get('/users')
    return res.data
  }
}
