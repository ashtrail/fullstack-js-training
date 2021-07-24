import http from '../http-common'

export default {
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

    addOrReplaceOneUser(state, payload) {
      const idx = state.users.findIndex((u) => u.id == payload.id)
      if (idx != -1) {
        state.users[idx] = payload
      } else {
        state.users.push(payload)
      }
    },

    deleteUser(state, id) {
      state.users = state.users.filter((u) => u.id != id)
    },

    setAllPosts(state, payload) {
      state.posts = payload
    },

    addOrReplaceOnePost(state, payload) {
      const idx = state.posts.findIndex((p) => p.id == payload.id)
      if (idx != -1) {
        state.posts[idx] = payload
      } else {
        state.posts.push(payload)
      }
    },

    deletePost(state, id) {
      state.posts = state.posts.filter((p) => p.id != id)
    },
  },
  actions: {
    async createUser({ commit }, { name }) {
      return http.post('/users', { name }).then(({ data }) => {
        commit('addOrReplaceOneUser', data)
      })
    },

    async fetchAllUsers(state) {
      return http.get('/users').then(({ data }) => {
        state.commit('setAllUsers', data)
      })
    },

    async fetchOneUser({ commit }, id) {
      return http.get(`/users/${id}`).then(({ data }) => {
        commit('addOrReplaceOneUser', data)
      })
    },

    async editUser({ commit }, { id, name }) {
      return http.patch(`/users/${id}`, { name }).then(({ data }) => {
        commit('addOrReplaceOneUser', data)
      })
    },

    async deleteUser({ commit, dispatch }, id) {
      await http.delete(`/users/${id}`)
      commit('deleteUser', id)
      // update posts, some might have been deleted in cascade
      await dispatch('fetchAllPosts')
    },

    async createPost({ commit }, { userId, title, content }) {
      const post = {
        userId,
        title,
        content,
      }
      return http.post('/posts', post).then(({ data }) => {
        console.log('res body =', data)
        commit('addOrReplaceOnePost', data)
      })
    },

    async fetchAllPosts(state) {
      return http.get('/posts').then(({ data }) => {
        console.log('fetch All Posts dispatch = ', data)
        state.commit('setAllPosts', data)
      })
    },

    async fetchOnePost({ commit }, id) {
      return http.get(`/posts/${id}`).then(({ data }) => {
        console.log('fetch One Posts dispatch = ', data)
        commit('addOrReplaceOnePost', data)
      })
    },

    async editPost({ commit }, { id, title, content }) {
      return http.patch(`/posts/${id}`, { title, content }).then(({ data }) => {
        commit('addOrReplaceOnePost', data)
      })
    },

    async deletePost({ commit, dispatch }, { id, userId }) {
      await http.delete(`/posts/${id}`)
      commit('deletePost', id)
      // update author so his posts are up to date
      await dispatch('fetchOneUser', userId)
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
}
