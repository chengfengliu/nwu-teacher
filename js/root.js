import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter, Route} from 'react-router-dom'
import {Provider} from 'react-redux'
import store from './redux/store'
import Index from './pages/index/Index'
import "antd/dist/antd.css"
import Workbench from './pages/workbench/Workbench';
export default class Root extends React.Component {
  render() {
    return(
      <Provider store={store}>
        <BrowserRouter>
          <Route path="/" exact component={Index}></Route>
          <Route path="/workbench" exact component={Workbench}></Route>
        </BrowserRouter>
      </Provider>
    )
  }
}

ReactDOM.render(<Root />, document.getElementById('root'))
