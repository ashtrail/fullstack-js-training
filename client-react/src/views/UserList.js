import { Component } from 'react'
import { Link } from 'react-router-dom'
import { UserForm } from '../components'
import http from '../http-common'

export default class UserList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      users: [],
    }

    this.createUser = this.createUser.bind(this)
  }

  async componentDidMount() {
    const { data } = await http.get('/users')
    this.setState({
      users: data,
    })
  }

  render() {
    const users = this.state.users.map((user) => (
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

            <ul>{users}</ul>
          </div>
        </div>
        <div className="column is-one-third">
          <h1 className="title">New User</h1>

          <UserForm onSubmit={this.createUser} />
        </div>
      </div>
    )
  }

  createUser(userName) {
    http
      .post('/users', { name: userName })
      .then(({ data }) => {
        this.setState({ users: [...this.state.users, data] })
      })
      .catch((err) => {
        console.log(`API error when creating new user ${userName}:`, err)
      })
  }
}
