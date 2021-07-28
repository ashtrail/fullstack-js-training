import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import { UserForm, LoadingData } from '../components'
import {
  selectUsers,
  createUser,
  selectStatus,
} from '../store/users/users.slice'

export default function UserList() {
  const users = useSelector(selectUsers)
  const status = useSelector(selectStatus)
  const dispatch = useDispatch()

  let userList = null
  if (status === 'loading') {
    userList = <LoadingData />
  } else {
    userList = users.map((user) => (
      <li key={user.id}>
        <Link to={`/users/${user.id}`}>{user.name}</Link>{' '}
        {user.posts.length > 0 ? '(author)' : ''}
      </li>
    ))
  }

  return (
    <div className="columns">
      <div className="column is-two-thirds">
        <div className="content">
          <h1 className="title">Users</h1>

          <ul>{userList}</ul>
        </div>
      </div>
      <div className="column is-one-third">
        <h1 className="title">New User</h1>

        <UserForm onSubmit={(user) => dispatch(createUser(user))} />
      </div>
    </div>
  )
}
