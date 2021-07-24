import { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { BlogPostForm, LoadingData, EntryNotFound } from '../components'
import http from '../http-common'

class BlogPost extends Component {
  constructor(props) {
    super(props)

    this.state = {
      edit: false,
      loaded: false,
      exists: true,
      post: {},
    }

    this.editPost = this.editPost.bind(this)
    this.deletePost = this.deletePost.bind(this)
  }

  componentDidMount() {
    const id = this.props.match.params.id
    http
      .get(`/posts/${id}`)
      .then(({ data }) => {
        this.setState({
          post: data,
          loaded: true,
          exists: true,
        })
      })
      .catch((err) => {
        console.log(`fetch post with id ${id} failed, error = `, err)
        this.setState({
          loaded: true,
          exists: false,
        })
      })
  }

  readModeRender() {
    return (
      <div>
        <h1 className="title">{this.state.post.title}</h1>
        <h2 className="subtitle is-5">
          Author:{' '}
          <Link to={`/users/${this.state.post.author.id}`}>
            {this.state.post.author.name}
          </Link>
        </h2>
        <div className="content">{this.state.post.content}</div>

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
            onClick={this.deletePost}
          >
            Delete
          </button>
        </div>
      </div>
    )
  }

  editModeRender() {
    return (
      <div>
        <h1 className="title">Edit Post</h1>
        <BlogPostForm
          populateWith={this.state.post}
          onSubmit={this.editPost}
          onClose={() => this.setState({ edit: false })}
        />
      </div>
    )
  }

  render() {
    if (!this.state.loaded) {
      return <LoadingData />
    } else if (this.state.loaded && !this.state.exists) {
      return <EntryNotFound value={'Post'} />
    } else if (this.state.edit) {
      return this.editModeRender()
    } else {
      return this.readModeRender()
    }
  }

  editPost(editedPost) {
    const id = this.state.post.id
    http
      .patch(`/posts/${id}`, editedPost)
      .then(({ data }) => {
        this.setState({ post: data })
      })
      .catch((err) => {
        console.log(`API error when updating post with id ${id}:`, err)
      })
  }

  deletePost() {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const id = this.state.post.id
      http
        .delete(`/posts/${this.state.post.id}`)
        .then(() => {
          this.props.history.push('/posts')
        })
        .catch((err) => {
          console.log(`API error when deleting post with id ${id}:`, err)
        })
    }
  }
}

export default withRouter(BlogPost)
