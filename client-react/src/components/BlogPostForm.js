import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../store/users/users.slice'
import { ErrorMessage } from '@hookform/error-message'

export default function BlogPostForm(props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm({ mode: 'onBlur' })
  const currentUser = useSelector(selectCurrentUser)

  const onClose = (event) => {
    event?.preventDefault?.()
    props.onClose?.()
  }

  const editingExistingPost = !!props.post
  const validUserId = !editingExistingPost ? currentUser !== null : true
  const canSubmit = isValid && validUserId

  const onSubmit = (data) => {
    if (!canSubmit) return
    const post = editingExistingPost
      ? data
      : { ...data, userId: currentUser.id }
    props.onSubmit?.(post)
    reset()
    onClose()
  }

  const renderError = ({ message }) => (
    <p className="help is-danger">{message}</p>
  )

  return (
    <form id="blog-post-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="field">
        <label className="label">Title</label>
        <div className="control">
          <input
            className={`input ${errors.title ? 'is-danger' : ''}`}
            type="text"
            placeholder="Post Title"
            {...register('title', {
              required: 'Title cannot be empty',
              minLength: {
                value: 3,
                message: 'Title must be at least 3 characters long',
              },
            })}
            defaultValue={props.post?.title}
          />
        </div>
        <ErrorMessage errors={errors} name="title" render={renderError} />
      </div>

      <div className="field">
        <label className="label">Content</label>
        <div className="control">
          <textarea
            className={`textarea ${errors.content ? 'is-danger' : ''}`}
            placeholder="Post Content"
            {...register('content', { required: 'Content cannot be empty' })}
            defaultValue={props.post?.content}
          ></textarea>
        </div>
        <ErrorMessage errors={errors} name="content" render={renderError} />
      </div>

      {isDirty && !validUserId && (
        <div className="field">
          {renderError({
            message: 'You need to be "logged in" as a user to add a post',
          })}
        </div>
      )}

      <div className="field is-grouped">
        <div className="control">
          <button
            type="submit"
            className="button is-primary"
            disabled={canSubmit ? false : true}
          >
            {editingExistingPost ? 'Edit' : 'Create'}
          </button>
        </div>

        {editingExistingPost && (
          <div className="control">
            <button className="button is-danger is-outlined" onClick={onClose}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </form>
  )
}
