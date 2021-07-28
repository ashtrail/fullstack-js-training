import { useState } from 'react'
import { Link, useParams, useHistory } from 'react-router-dom'
import { UserForm, EntryNotFound } from '../components'
import { useSelector, useDispatch } from 'react-redux'
import {
  deleteUser,
  selectUserById,
  updateUser,
} from '../store/users/users.slice'

export default function UserList() {
  const id = parseInt(useParams().id)
  const user = useSelector((state) => selectUserById(state, id))
  const [inEditMode, setEditMode] = useState(false)
  const dispatch = useDispatch()
  const history = useHistory()

  if (!user) {
    return <EntryNotFound value={'User'} />
  } else if (inEditMode) {
    return (
      <div>
        <h1 className="title">Edit User</h1>
        <UserForm
          user={{ ...user }}
          onSubmit={(updatedUser) => dispatch(updateUser({ id, updatedUser }))}
          onClose={() => setEditMode(false)}
        />
      </div>
    )
  } else {
    const posts = user.posts.map((post) => (
      <li key={post.id}>
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </li>
    ))

    return (
      <div className="content">
        <h1 className="title">{user.name}</h1>

        <div className="buttons">
          <button className="button" onClick={() => setEditMode(true)}>
            Edit
          </button>
          <button
            className="button is-danger is-outlined"
            onClick={() => {
              const confirmed = window.confirm(
                'Are you sure you want to delete this user?'
              )
              if (confirmed) {
                dispatch(deleteUser(id))
                history.push('/users')
              }
            }}
          >
            Delete
          </button>
        </div>

        <h2 className="subtitle is-4">Posts</h2>
        <ul>{posts}</ul>
      </div>
    )
  }
}
