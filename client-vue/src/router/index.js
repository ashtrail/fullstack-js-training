import { createRouter, createWebHashHistory } from 'vue-router'
import { AuthorList, BlogPost, Blog, User } from '@/views'

const routes = [
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
    path: '/authors',
    component: AuthorList,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
