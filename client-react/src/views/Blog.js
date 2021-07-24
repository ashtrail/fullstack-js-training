import { Component } from 'react'
import { Link } from 'react-router-dom'
import { BlogPostForm } from '../components'
import http from '../http-common'

export default class Blog extends Component {
  constructor(props) {
    super(props)

    this.state = {
      posts: [],
    }

    this.createPost = this.createPost.bind(this)
  }

  async componentDidMount() {
    const { data } = await http.get('/posts')
    this.setState({
      posts: data,
    })
  }

  render() {
    const blogPosts = this.state.posts.map((post) => (
      <li key={post.id}>
        <Link to={`/posts/${post.id}`}>{post.title}</Link> by {post.author.name}
      </li>
    ))

    return (
      <div className="columns">
        <div className="column is-two-thirds">
          <div className="content">
            <h1 className="title">React Blog</h1>

            <ul>{blogPosts}</ul>
          </div>
        </div>

        <div className="column is-one-third">
          <h1 className="title">New Post</h1>
          <BlogPostForm onSubmit={this.createPost} />
        </div>
      </div>
    )
  }

  createPost(post) {
    http
      .post('/posts', post)
      .then(({ data }) => {
        this.setState({ posts: [...this.state.posts, data] })
      })
      .catch((err) => {
        console.log(`API error when creating new post ${post.title}:`, err)
      })
  }
}
