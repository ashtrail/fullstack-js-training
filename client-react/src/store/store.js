import { configureStore } from '@reduxjs/toolkit'

import usersReducer from './users/users.slice'
// TODO: Add Post reducer
// import postsReducer from './store/posts/posts.slice'

const store = configureStore({
  reducer: {
    users: usersReducer,
    // posts: postsReducer,
  },
})

export default store
