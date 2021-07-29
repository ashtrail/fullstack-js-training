import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit'
import http from '../../http-common'

const initialState = {
  status: 'idle',
  currentUser: null,
  userList: [],
}

// Thunk functions
export const createUser = createAsyncThunk('users/create', async (user) => {
  const response = await http.post('/users', user)
  return response.data
})

export const fetchAllUsers = createAsyncThunk('users/fetchAll', async () => {
  const response = await http.get('/users')
  return response.data
})

export const fetchOneUser = createAsyncThunk('users/fetchOne', async (id) => {
  const response = await http.get(`/users/${id}`)
  return response.data
})

export const updateUser = createAsyncThunk(
  'users/update',
  async ({ id, updatedUser }) => {
    const response = await http.patch(`/users/${id}`, updatedUser)
    return response.data
  }
)

export const deleteUser = createAsyncThunk('users/delete', async (id) => {
  await http.delete(`/users/${id}`)
  return id
})

// Reducer
const upsertUser = (state, user) => {
  const idx = state.userList.findIndex((u) => u.id === user.id)
  if (idx !== -1) {
    state.userList[idx] = user
  } else {
    state.userList.push(user)
  }
}

const updateCreatedPost = createAction('posts/create/fulfilled')
const updateUpdatedPost = createAction('posts/update/fulfilled')
const updateDeletedPost = createAction('posts/delete/fulfilled')

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setCurrentUser(state, action) {
      state.currentUser = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUser.fulfilled, (state, action) => {
        const user = action.payload
        state.userList.push(user)
      })
      .addCase(fetchAllUsers.pending, (state, _action) => {
        state.status = 'loading'
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.userList = action.payload
        state.status = 'idle'
      })
      .addCase(fetchOneUser.pending, (state, _action) => {
        state.status = 'loading'
      })
      .addCase(fetchOneUser.fulfilled, (state, action) => {
        upsertUser(state, action.payload)
        state.status = 'idle'
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        upsertUser(state, action.payload)
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        const idx = state.userList.findIndex((u) => u.id === action.payload)
        if (idx !== -1) {
          state.userList.splice(idx, 1)
        }
      })

      // Post related actions
      .addCase(updateCreatedPost, (state, action) => {
        const post = action.payload
        const user = state.userList.find((u) => u.id === post.userId)
        if (user) {
          user.posts.push(post)
        }
      })
      .addCase(updateUpdatedPost, (state, action) => {
        const post = action.payload
        const user = state.userList.find((u) => u.id === post.userId)
        if (user) {
          user.posts = user.posts.map((p) => (p.id === post.id ? post : p))
        }
      })
      .addCase(updateDeletedPost, (state, action) => {
        const { id, userId } = action.payload
        const user = state.userList.find((u) => u.id === userId)
        if (user) {
          user.posts = user.posts.filter((p) => p.id !== id)
        }
      })
  },
})

export const { setCurrentUser } = usersSlice.actions

export default usersSlice.reducer

// Selectors
export const selectUsers = (state) => {
  return state.users.userList
}

export const selectStatus = (state) => {
  return state.users.status
}

export const selectCurrentUser = (state) => state.users.currentUser

export const selectUserById = (state, userId) =>
  selectUsers(state).find((user) => user.id === userId)
