import './main.scss'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Blog, NotFound, User, UserList } from './views'
import NavBar from './components/NavBar'
import './App.css'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />

        <div className="section">
          <div className="container">
            <Switch>
              <Route exact path={['/', '/blog', '/posts']}>
                <Blog />
              </Route>
              <Route exact path="/users/:id" component={User} />
              <Route exact path="/users" component={UserList} />

              <Route path="*">
                <NotFound />
              </Route>
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
