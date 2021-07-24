import { Component } from 'react'
import http from '../http-common'

export default class UserForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      edit: false,
      usernameAvailable: true,
      username: '',
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.close = this.close.bind(this)
  }

  componentDidMount() {
    if (this.props.populateWith?.name) {
      this.setState({
        username: this.props.populateWith.name,
        edit: true,
        usernameAvailable: false,
      })
    }
  }

  canSubmit() {
    return this.state.username !== '' && this.state.usernameAvailable
  }

  handleSubmit(event) {
    event.preventDefault()
    this.submit()
  }

  submit() {
    if (this.canSubmit()) {
      this.props.onSubmit(this.state.username)
      this.clearForm()
      this.close()
    }
  }

  clearForm() {
    this.setState({
      username: '',
      edit: false,
    })
  }

  close(event) {
    event?.preventDefault?.()
    this.props.onClose?.()
  }

  handleChange(event) {
    const value = event.target.value
    this.setState({ username: value })
    http
      .get('/users/available', { params: { name: value } })
      .then(({ data }) => {
        this.setState({ usernameAvailable: data.available })
      })
  }

  render() {
    let formInfo = <p></p>
    if (this.state.username !== '') {
      if (this.state.usernameAvailable) {
        formInfo = <p className="help is-success">This username is available</p>
      } else if (this.state.username === this.props.populateWith?.name) {
        formInfo = (
          <p className="help is-danger">This is the current username</p>
        )
      } else if (!this.state.usernameAvailable) {
        formInfo = (
          <p className="help is-danger">This username is not available</p>
        )
      }
    }

    return (
      <form onSubmit={this.handleSubmit}>
        <div className="field">
          <label className="label">Name</label>
          <div className="control">
            <input
              className="input"
              type="text"
              placeholder="John Doe"
              value={this.state.username}
              onChange={this.handleChange}
            />
          </div>
          {formInfo}
        </div>

        <div className="buttons">
          <button
            className="button is-primary"
            type="submit"
            disabled={this.canSubmit() ? '' : false}
          >
            {this.state.edit ? 'Edit' : 'Create'}
          </button>
          {this.state.edit === true && (
            <button
              className="button is-danger is-outlined"
              onClick={this.close}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    )
  }
}
