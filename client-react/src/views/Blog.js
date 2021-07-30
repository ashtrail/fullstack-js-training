import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { BlogPostForm, LoadingData } from '../components'

import {
  selectPosts,
  createPost,
  selectStatus,
} from '../store/posts/posts.slice'

export default function Blog() {
  const posts = useSelector(selectPosts)
  const status = useSelector(selectStatus)
  const dispatch = useDispatch()

  let blogPosts
  if (status === 'loading') {
    blogPosts = <LoadingData />
  } else {
    blogPosts = posts.map((post) => (
      <li key={post.id}>
        <Link to={`/posts/${post.id}`}>{post.title}</Link> by{' '}
        <Link to={`/users/${post.userId}`}>{post.author.name}</Link>
      </li>
    ))
  }

  return (
    <div className="columns">
      <div className="column is-two-thirds" data-test="blog">
        <div className="content">
          <h1 className="title">React Blog</h1>

          <ul>{blogPosts}</ul>
        </div>
      </div>

      <div className="column is-one-third">
        <h1 className="title">New Post</h1>
        <BlogPostForm onSubmit={(post) => dispatch(createPost(post))} />
      </div>
    </div>
  )
}
