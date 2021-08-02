import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit'
import http from '../../http-common'

const initialState = {
  status: 'idle',
  postList: [],
}

// Thunk functions
export const createPost = createAsyncThunk('posts/create', async (post) => {
  const response = await http.post('/posts', post)
  return response.data
})

export const fetchAllPosts = createAsyncThunk('posts/fetchAll', async () => {
  const response = await http.get('/posts')
  return response.data
})

export const fetchOnePost = createAsyncThunk('posts/fetchOne', async (id) => {
  const response = await http.get(`/posts/${id}`)
  return response.data
})

export const updatePost = createAsyncThunk(
  'posts/update',
  async ({ id, updatedPost }) => {
    const response = await http.patch(`/posts/${id}`, updatedPost)
    return response.data
  }
)

export const deletePost = createAsyncThunk(
  'posts/delete',
  async ({ id, userId }) => {
    await http.delete(`/posts/${id}`)
    return { id, userId }
  }
)

// Reducer
const upsertPost = (state, post) => {
  const idx = state.postList.findIndex((u) => u.id === post.id)
  if (idx !== -1) {
    state.postList[idx] = post
  } else {
    state.postList.push(post)
  }
}

const deletePostsOnCascade = createAction('users/delete/fulfilled')
const updateUpdatedAuthor = createAction('users/update/fulfilled')

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setCurrentPost(state, action) {
      state.currentPost = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPost.fulfilled, (state, action) => {
        const post = action.payload
        state.postList.push(post)
      })
      .addCase(fetchAllPosts.pending, (state, _action) => {
        state.status = 'loading'
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.postList = action.payload
        state.status = 'idle'
      })
      .addCase(fetchOnePost.pending, (state, _action) => {
        state.status = 'loading'
      })
      .addCase(fetchOnePost.fulfilled, (state, action) => {
        upsertPost(state, action.payload)
        state.status = 'idle'
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        upsertPost(state, action.payload)
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const { id } = action.payload
        const idx = state.postList.findIndex((p) => p.id === id)
        if (idx !== -1) {
          state.postList.splice(idx, 1)
        }
      })

      // User related actions
      .addCase(updateUpdatedAuthor, (state, action) => {
        const author = action.payload
        state.postList = state.postList.map((post) =>
          post.userId === author.id
            ? {
                ...post,
                author,
              }
            : post
        )
      })
      .addCase(deletePostsOnCascade, (state, action) => {
        const userId = action.payload
        state.postList = state.postList.filter((p) => p.userId !== userId)
      })
  },
})

export const { setCurrentPost } = postsSlice.actions

export default postsSlice.reducer

// Selectors
export const selectPosts = (state) => {
  return state.posts.postList
}

export const selectStatus = (state) => {
  return state.posts.status
}

export const selectPostById = (state, postId) =>
  selectPosts(state).find((post) => post.id === postId)
