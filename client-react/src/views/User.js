import { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { UserForm, LoadingData, EntryNotFound } from '../components'
import http from '../http-common'

class User extends Component {
  constructor(props) {
    super(props)

    this.state = {
      edit: false,
      loaded: false,
      exists: true,
      user: {},
    }

    this.editUser = this.editUser.bind(this)
    this.deleteUser = this.deleteUser.bind(this)
  }

  componentDidMount() {
    const id = this.props.match.params.id
    http
      .get(`/users/${id}`)
      .then(({ data }) => {
        this.setState({
          user: data,
          loaded: true,
          exists: true,
        })
      })
      .catch((err) => {
        console.log(`fetch user with id ${id} failed, error = `, err)
        this.setState({
          loaded: true,
          exists: false,
        })
      })
  }

  readModeRender() {
    const posts = this.state.user.posts.map((post) => (
      <li key={post.id}>
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </li>
    ))

    return (
      <div className="content">
        <h1 className="title">{this.state.user.name}</h1>

        <div className="buttons">
          <button
            className="button"
            onClick={() => {
              this.setState({ edit: true })
            }}
          >
            Edit
          </button>
          <button
            className="button is-danger is-outlined"
            onClick={this.deleteUser}
          >
            Delete
          </button>
        </div>

        <h2 className="subtitle is-4">Posts</h2>
        <ul>{posts}</ul>
      </div>
    )
  }

  editModeRender() {
    return (
      <div>
        <h1 className="title">Edit User</h1>
        <UserForm
          user={{ ...this.state.user }}
          onSubmit={this.editUser}
          onClose={() => this.setState({ edit: false })}
        />
      </div>
    )
  }

  render() {
    if (!this.state.loaded) {
      return <LoadingData />
    } else if (this.state.loaded && !this.state.exists) {
      return <EntryNotFound value={'User'} />
    } else if (this.state.edit) {
      return this.editModeRender()
    } else {
      return this.readModeRender()
    }
  }

  editUser(editedName) {
    const id = this.state.user.id
    http
      .patch(`/users/${id}`, { name: editedName })
      .then(({ data }) => {
        this.setState({ user: data })
      })
      .catch((err) => {
        console.log(`API error when updating user with id ${id}:`, err)
      })
  }

  deleteUser() {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const id = this.state.user.id
      http
        .delete(`/users/${this.state.user.id}`)
        .then(() => {
          this.props.history.push('/users')
        })
        .catch((err) => {
          console.log(`API error when deleting user with id ${id}:`, err)
        })
    }
  }
}

export default withRouter(User)
