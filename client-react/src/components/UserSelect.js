import { Component } from 'react'
import http from '../http-common'

export default class UserSelect extends Component {
  constructor(props) {
    super(props)

    this.state = {
      users: [],
      currentUser: null,
      selectValue: '',
    }

    this.handleChange = this.handleChange.bind(this)
  }

  async componentDidMount() {
    const { data } = await http.get('/users')
    this.setState({
      users: data,
    })
  }

  handleChange(event) {
    const value = event.target.value
    const id = parseInt(value)
    const user = this.state.users.find((u) => u.id === id)
    if (user) {
      this.setState({ currentUser: user, selectValue: value })
    } else {
      this.setState({ currentUser: null, selectValue: '' })
    }
  }

  render() {
    // add an empty default option
    const usersOptions = [{ id: '', name: '' }, ...this.state.users]
    const options = usersOptions.map((user) => (
      <option value={user.id} key={user.id}>
        {user.name}
      </option>
    ))
    return (
      <div className="columns">
        <div className="column">
          <div className="navbar-item">I am :</div>
        </div>
        <div className="column">
          <div className="select">
            <select value={this.state.selectValue} onChange={this.handleChange}>
              {options}
            </select>
          </div>
        </div>
      </div>
    )
  }
}
