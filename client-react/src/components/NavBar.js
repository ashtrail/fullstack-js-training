import { Component } from 'react'
import { Link } from 'react-router-dom'
import UserSelect from './UserSelect'

export default class NavBar extends Component {
  render() {
    return (
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="container">
          <div className="navbar-brand">
            <button
              className="navbar-burger"
              aria-label="menu"
              aria-expanded="false"
            >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </button>
          </div>

          <div className="navbar-menu">
            <div className="navbar-start">
              <Link className="navbar-item" to="/blog">
                Blog
              </Link>
              <Link className="navbar-item" to="/users">
                Users
              </Link>
            </div>
            <div className="navbar-end">
              <UserSelect />
            </div>
          </div>
        </div>
      </nav>
    )
  }
}
