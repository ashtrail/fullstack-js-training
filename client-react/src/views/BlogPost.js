import { useState } from 'react'
import { Link, useParams, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { BlogPostForm, EntryNotFound } from '../components'
import {
  selectPostById,
  updatePost,
  deletePost,
} from '../store/posts/posts.slice'

export default function BlogPost() {
  const id = parseInt(useParams().id)
  const post = useSelector((state) => selectPostById(state, id))
  const [inEditMode, setEditMode] = useState(false)
  const dispatch = useDispatch()
  const history = useHistory()

  if (!post) {
    return <EntryNotFound value={'Post'} />
  } else if (inEditMode) {
    return (
      <div>
        <h1 className="title">Edit Post</h1>
        <BlogPostForm
          post={{ ...post }}
          onSubmit={(updatedPost) => dispatch(updatePost({ id, updatedPost }))}
          onClose={() => setEditMode(false)}
        />
      </div>
    )
  } else {
    return (
      <div>
        <h1 className="title">{post.title}</h1>
        <h2 className="subtitle is-5">
          Author:{' '}
          <Link to={`/users/${post.author.id}`}>{post.author.name}</Link>
        </h2>
        <div className="content">{post.content}</div>

        <div className="buttons">
          <button className="button" onClick={() => setEditMode(true)}>
            Edit
          </button>
          <button
            className="button is-danger is-outlined"
            onClick={() => {
              const confirmed = window.confirm(
                'Are you sure you want to delete this post?'
              )
              if (confirmed) {
                dispatch(deletePost({ id, userId: post.userId }))
                history.push('/posts')
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>
    )
  }
}
