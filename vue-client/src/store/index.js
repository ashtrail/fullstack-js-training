import { createStore } from 'vuex'
import http from '../http-common'

export default createStore({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    currentUser: null,
    users: [],
    posts: [],
  },
  mutations: {
    setCurrentUser(state, payload) {
      state.currentUser = payload
    },

    setAllUsers(state, payload) {
      state.users = payload
    },

    addUser(state, { edit, user }) {
      if (edit) {
        // remove old version of user if it already exist
        state.users = state.users.filter((u) => u.id != user.id)
      }
      // add new version to the list of posts
      state.users.push(user)
    },

    setAllPosts(state, payload) {
      state.posts = payload
    },

    addPost(state, { edit, post }) {
      if (edit) {
        // remove old version of post if it already exist
        state.posts = state.posts.filter((p) => p.id != post.id)
      }
      // add new version to the list of posts
      state.posts.push(post)
    },
  },
  actions: {
    async createUser({ commit }, { name }) {
      return http.post('/users', { name }).then(({ data }) => {
        console.log('res body =', data)
        commit('addUser', { edit: false, user: data })
      })
    },

    async fetchAllUsers(state) {
      return http.get('/users').then(({ data }) => {
        state.commit('setAllUsers', data)
      })
    },

    async createPost({ commit }, { author, title, body }) {
      const post = {
        author,
        title,
        body,
      }
      return http.post('/posts', post).then(({ data }) => {
        console.log('res body =', data)
        commit('addPost', { edit: false, post: data })
      })
    },

    async fetchAllPosts(state) {
      return http.get('/posts').then(({ data }) => {
        state.commit('setAllPosts', data)
      })
    },
  },
  modules: {},
  getters: {
    getCurentUserId: (state) =>
      state.currentUser ? state.currentUser.id : null,

    getUserById: (state) => (id) => state.users.find((user) => user.id == id),

    getPostById: (state) => (id) => state.posts.find((post) => post.id == id),

    getAllPostAuthors: (state) =>
      state.users.filter((user) => user.posts.length > 0),
  },
})
