import React, { Component } from 'react'
import $ from 'jquery'
import {Row, Col} from 'antd'
import LoginForm from './components/LoginForm.js'
import Header from '../../components/Header.js'
import Footer from '../../components/Footer.js'
import {login} from '../../redux/action.js'
import store from '../../redux/store.js'
import '../../../css/index.css'
class Login extends Component { 
  constructor(props) {
    super(props)
    this.state = {
      warning: false
    }
  }
  handlePost(data) {
    const _that = this
    $.ajax({
      url: '/api/findUser',
      type: 'post',
      data,
      success(responseData) {
        console.log(responseData, responseData.success, typeof responseData.job_id)
        if(responseData.success) {
          store.dispatch(login(responseData.userName, responseData.level, responseData.job_id))
          if(responseData.level === 'visitor') {
            // 用户登录成功
            console.log('visitor succ')
            _that.props.history.push('/workbench')
          } else if(responseData.level === 'assistant') {
            // 助理登录成功
            console.log('assistant succ')
            _that.props.history.push('/workbench')
          } else if(responseData.level === 'admin') {
            // 管理员登录成功
            console.log('admin succ')
            _that.props.history.push('/workbench')
          }
        } else {
          // 密码错误
          console.log('fail')
          _that.setState({
            warning: true
          })
        }
      }
    })
  }
  render() {
    const warning = this.state.warning ? <div className="warning">您输入的帐号或密码不正确，请重新输入</div> : null
    return (
      <div>
        <Header />
        <Row>
          <Col span={2}>
          </Col>
          <Col span={14}>
          <img src="/images/developer.png"></img>
          </Col>
          <Col span={6}>
            <div id="loginForm"> 
              {warning}
              <LoginForm onPost={this.handlePost.bind(this)} />
            </div>
          </Col>
          <Col span={2}>
          </Col>
        </Row>
        <Footer />
      </div>
    )
  }
}

export default Login