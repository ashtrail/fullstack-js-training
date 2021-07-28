import http from '../http-common'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'

export default function UserForm(props) {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm({ mode: 'onChange' })

  // Check if we are creating a new user or editing an existing one
  const editingExistingUser = !!props.user

  const onClose = (event) => {
    event?.preventDefault?.()
    props.onClose?.()
  }

  const onSubmit = (data) => {
    props.onSubmit?.({ name: data.name })
    reset()
    onClose()
  }

  const username = register('name', {
    required: 'User name cannot be empty',
    validate: {
      notCurrentUsername: (value) =>
        value !== props.user?.name || 'This is the current username',
      available: async (value) =>
        (await http.get('/users/available', { params: { name: value } }))?.data
          ?.available || 'This username is not available',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="field">
        <label className="label">Name</label>
        <div className="control">
          <input
            className={`input ${isDirty && !isValid ? 'is-danger' : ''}`}
            type="text"
            placeholder="John Doe"
            {...username}
            defaultValue={props.user?.name}
          />
        </div>
        <ErrorMessage
          errors={errors}
          name="name"
          render={({ message }) => <p className="help is-danger">{message}</p>}
        />
        {isValid && (
          <p className="help is-success">This username is available</p>
        )}
      </div>

      <div className="buttons">
        <button
          className="button is-primary"
          type="submit"
          disabled={!isValid ? true : false}
        >
          {editingExistingUser ? 'Edit' : 'Create'}
        </button>

        {editingExistingUser && (
          <button className="button is-danger is-outlined" onClick={onClose}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
