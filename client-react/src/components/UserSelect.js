import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectCurrentUser,
  setCurrentUser,
  selectUsers,
} from '../store/users/users.slice'

export default function UserSelect() {
  const users = useSelector(selectUsers)
  const currentUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch()

  const emptyOption = ''
  const defaultSelectValue = currentUser
    ? toString(currentUser.id)
    : emptyOption
  const [selectValue, editSelectValue] = useState(defaultSelectValue)

  const handleChange = (event) => {
    const value = event.target.value
    const id = parseInt(value)
    const user = users.find((u) => u.id === id)
    if (user) {
      dispatch(setCurrentUser(user))
      editSelectValue(value)
    } else {
      dispatch(setCurrentUser(null))
      editSelectValue(emptyOption)
    }
  }

  // add an empty default option
  const usersOptions = [{ id: emptyOption, name: '' }, ...users]
  const options = usersOptions.map((user) => (
    <option value={user.id} key={user.id}>
      {user.name}
    </option>
  ))
  return (
    <div data-test="user-select" className="columns">
      <div className="column">
        <div className="navbar-item">I am :</div>
      </div>
      <div className="column">
        <div className="select">
          <select value={selectValue} onChange={handleChange}>
            {options}
          </select>
        </div>
      </div>
    </div>
  )
}
