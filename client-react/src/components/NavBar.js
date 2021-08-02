// import { Component } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import UserSelect from './UserSelect'

export default function NavBar() {
  const [isActive, setisActive] = useState(false)

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="container">
        <div className="navbar-brand">
          <button
            className={`navbar-burger burger ${isActive ? 'is-active' : ''}`}
            aria-label="menu"
            aria-expanded="false"
            onClick={() => {
              setisActive(!isActive)
            }}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
        </div>

        <div className={`navbar-menu ${isActive ? 'is-active' : ''}`}>
          <div className="navbar-start">
            <Link className="navbar-item" data-test="navlink-blog" to="/blog">
              Blog
            </Link>
            <Link className="navbar-item" data-test="navlink-users" to="/users">
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
