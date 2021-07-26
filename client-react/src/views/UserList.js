import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { UserForm } from '../components'
import http from '../http-common'

export default function UserList() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const result = await http.get('/users')
      setUsers(result.data)
    }

    fetchData()
  }, [])

  const createUser = (userName) => {
    http
      .post('/users', { name: userName })
      .then(({ data }) => {
        setUsers([...users, data])
      })
      .catch((err) => {
        console.log(`API error when creating new user ${userName}:`, err)
      })
  }

  // Render
  const usersList = users.map((user) => (
    <li key={user.id}>
      <Link to={`/users/${user.id}`}>{user.name}</Link>{' '}
      {user.posts.length > 0 ? '(author)' : ''}
    </li>
  ))

  return (
    <div className="columns">
      <div className="column is-two-thirds">
        <div className="content">
          <h1 className="title">Users</h1>

          <ul>{usersList}</ul>
        </div>
      </div>
      <div className="column is-one-third">
        <h1 className="title">New User</h1>

        <UserForm onSubmit={createUser} />
      </div>
    </div>
  )
}
