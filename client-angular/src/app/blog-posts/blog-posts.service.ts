import { Injectable } from '@angular/core'
import http from '../../../src/http-common'
import { BlogPost } from './blog-post'

@Injectable({
  providedIn: 'root',
})
export class BlogPostService {
  constructor() {}

  async getUsers(): Promise<BlogPost[]> {
    const res = await http.get('/posts')
    return res.data
  }
}
