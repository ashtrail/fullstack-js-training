import './main.scss'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Blog, NotFound } from './views'

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
              <Route exact path="/">
                <Blog />
              </Route>
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
