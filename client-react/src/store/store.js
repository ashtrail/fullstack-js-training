import { configureStore } from '@reduxjs/toolkit'

import usersReducer from './users/users.slice'
import postsReducer from './posts/posts.slice'

const store = configureStore({
  reducer: {
    users: usersReducer,
    posts: postsReducer,
  },
})

export default store
