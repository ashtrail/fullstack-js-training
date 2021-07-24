import { UserList, BlogPost, Blog, User } from '@/views'

export default [
  {
    path: '/blog',
    name: 'Blog',
    component: Blog,
    alias: ['/', '/posts'],
  },
  {
    path: '/posts/:id',
    component: BlogPost,
    name: 'BlogPost',
  },
  {
    path: '/users/:id',
    component: User,
  },
  {
    path: '/users',
    component: UserList,
  },
]
