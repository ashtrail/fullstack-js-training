import { Component } from 'react'
const _pick = require('lodash.pick')

export default class BlogPostForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      edit: false,
      submitting: false,
      error: false,
      success: false,
      post: {
        userId: null,
        id: null,
        title: '',
        content: '',
      },
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.close = this.close.bind(this)
  }

  componentDidMount() {
    if (this.props.populateWith) {
      this.setState({
        post: { ...this.props.populateWith },
        edit: true,
      })
    }
  }

  clearStatus() {
    this.setState({
      success: false,
      error: false,
    })
  }

  clearForm() {
    this.setState({
      edit: false,
      post: {
        userId: null,
        id: null,
        title: '',
        content: '',
      },
    })
  }

  handleSubmit(event) {
    event.preventDefault()

    this.setState({ submitting: true })
    this.clearStatus()

    if (!this.state.edit) {
      // TODO: Get 'logged in' user from store
      const post = { ...this.state.post }
      post.userId = 1
      this.setState({ post })
    }
    if (
      !this.state.post.title ||
      !this.state.post.content ||
      !this.state.post.userId
    ) {
      this.setState({ error: true })
      return
    }

    this.props.onSubmit(_pick(this.state.post, ['title', 'content', 'userId']))
    this.clearForm()
    this.setState({
      error: false,
      success: true,
      submitting: false,
    })
    this.close()
  }

  close(event) {
    event?.preventDefault?.()
    this.props.onClose?.()
  }

  handleInputChange(event) {
    const target = event.target

    const post = { ...this.state.post }
    post[target.name] = target.value
    this.setState({
      post,
    })
  }

  render() {
    return (
      <form id="blog-post-form" onSubmit={this.handleSubmit}>
        <div className="field">
          <label className="label">Title</label>
          <div className="control">
            <input
              className={`input ${
                this.state.submitting && !this.state.post.title
                  ? 'is-danger'
                  : ''
              }`}
              type="text"
              placeholder="Post Title"
              name="title"
              value={this.state.post.title}
              onChange={this.handleInputChange}
            />
          </div>
          {this.state.submitting && !this.state.post.title && (
            <p className="help is-danger">Title cannot be empty</p>
          )}
        </div>

        <div className="field">
          <label className="label">Content</label>
          <div className="control">
            <textarea
              className={`textarea ${
                this.state.submitting && !this.state.post.content
                  ? 'is-danger'
                  : ''
              }`}
              placeholder="Post Content"
              name="content"
              value={this.state.post.content}
              onChange={this.handleInputChange}
            ></textarea>
          </div>
          {this.state.submitting && !this.state.post.content && (
            <p className="help is-danger">Content cannot be empty</p>
          )}
        </div>

        {this.state.submitting && !this.state.error && (
          <div className="field">
            <p v-if="error && submitting" className="help is-danger">
              You need to be "logged in" as a user to add a post
            </p>
          </div>
        )}

        <div className="field is-grouped">
          <div className="control">
            <button type="submit" className="button is-primary">
              {this.state.edit ? 'Edit' : 'Create'}
            </button>
          </div>

          {this.state.edit && (
            <div className="control">
              <button
                className="button is-danger is-outlined"
                onClick={this.close}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </form>
    )
  }
}
