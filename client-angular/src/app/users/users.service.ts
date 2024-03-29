import { Injectable } from '@angular/core'
import http from '../../../src/http-common'
import { User } from './user'

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor() {}

  async createUser({ name }: User): Promise<void> {
    await http.post('/users', { name })
  }

  async getUsers(): Promise<User[]> {
    const res = await http.get('/users')
    return res.data
  }

  async getUserById(id: number): Promise<User> {
    const res = await http.get(`/users/${id}`)
    return res.data
  }

  async getAvailabilty(name: string): Promise<boolean> {
    const res = await http.get('/users/available', {
      params: { name },
    })
    return res.data.available
  }

  async updateUser({ id, name }: User): Promise<void> {
    await http.patch(`/users/${id}`, { name })
  }

  async deleteUser({ id }: User): Promise<void> {
    await http.delete(`/users/${id}`)
  }
}
