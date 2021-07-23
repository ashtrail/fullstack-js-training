import { Component } from 'react'

export default class Blog extends Component {
  constructor(props) {
    super(props)
    this.state = {
      posts: [
        {
          id: 1,
          title: 'Test 1',
        },
        {
          id: 2,
          title: 'Test 2',
        },
      ],
    }
  }

  render() {
    const blogPosts = this.state.posts.map((post) => (
      <li key={post.id}>{post.title}</li>
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
          <div>TODO: BlogPostForm</div>
        </div>
      </div>
    )
  }
}
