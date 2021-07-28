import React, { useState } from 'react'
import http from '../http-common'
import { useForm } from 'react-hook-form'

export default function UserForm(props) {
  const { register, reset, handleSubmit } = useForm()

  // Check if we are creating a new user or editing an existing one
  const editingExistingUser = !!props.user

  const currentUsernameErrorMessage = 'This is the current username'
  const initialValidation = {
    valid: false,
    showHelp: editingExistingUser,
    message: editingExistingUser ? currentUsernameErrorMessage : '',
  }
  const [validation, setValidation] = useState(initialValidation)

  const onClose = (event) => {
    event?.preventDefault?.()
    props.onClose?.()
  }

  const clearForm = () => {
    reset()
    setValidation(initialValidation)
  }

  const onSubmit = (data) => {
    if (!validation.valid) return
    props.onSubmit?.({ name: data.name })
    clearForm()
    onClose()
  }

  const validate = async (value) => {
    const res = await http.get('/users/available', {
      params: { name: value },
    })
    let valid = false
    let message = ''
    if (value === '') {
      message = 'User name cannot be empty'
    } else if (value === props.user?.name) {
      message = currentUsernameErrorMessage
    } else if (!res.data?.available) {
      message = 'This username is not available'
    } else {
      message = 'This username is available'
      valid = true
    }
    setValidation({ valid, message, showHelp: true })
  }

  const helpClass = `help ${validation.valid ? 'is-success' : 'is-danger'}`
  const helpMessage = <p className={helpClass}>{validation.message}</p>

  const username = register('name')

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="field">
        <label className="label">Name</label>
        <div className="control">
          <input
            className={`input ${
              validation.showHelp && !validation.valid ? 'is-danger' : ''
            }`}
            type="text"
            placeholder="John Doe"
            {...username}
            onChange={(e) => {
              username.onChange(e)
              validate(e.target.value)
            }}
            defaultValue={props.user?.name}
          />
        </div>
        {validation.showHelp && helpMessage}
      </div>

      <div className="buttons">
        <button
          className="button is-primary"
          type="submit"
          disabled={!validation.valid ? true : false}
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
