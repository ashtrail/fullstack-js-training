import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import AuthorList from '../views/AuthorList.vue'
import BlogPost from '../views/BlogPost.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/About.vue')
    },
  },
  {
    path: '/blog',
    name: 'Blog',
    component: function () {
      return import('../views/Blog.vue')
    },
  },
  {
    path: '/posts/:id',
    component: BlogPost,
    name: 'BlogPost',
  },
  {
    path: '/users/:id',
    component: import('../views/User.vue'),
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
