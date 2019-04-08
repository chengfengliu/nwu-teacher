import React, { Component } from 'react'
import { Row, Col, Modal, Form, Input, message } from 'antd'
import {Link} from 'react-router-dom'
import { connect } from 'react-redux'
import $ from 'jquery'
import '../../css/header.css'
import store from '../redux/store.js'
class VHeader extends Component {
  constructor(porps) {
    super(porps)
    this.state = {
      showMenu: false,
      showModal: false,
      notSamePassword: false,
      isEmpty: false,
      isError: false,
    }
  }

  componentDidUpdate() {
    // console.log('did update', this.refs)
    if(this.refs.canvas) {
      const ctx = this.refs.canvas.getContext('2d')
      ctx.strokeStyle = '#FFF'
      ctx.lineWidth = '2'
      ctx.beginPath()
      ctx.moveTo(0, 3)
      ctx.lineTo(25, 3)
      ctx.moveTo(0, 10)
      ctx.lineTo(25, 10)
      ctx.moveTo(0, 17)
      ctx.lineTo(25, 17)
      ctx.closePath()
      ctx.stroke()
    }
  }

  clickMenu() {
    this.setState(prevState => ({
      showMenu: !prevState.showMenu
    }))
  }
  
  showModal() {
    this.setState({
      showModal: true,
      newPassword: '',
      confirmPassword: '',
      isEmpty: false,
      isError: false,
      notSamePassword: false,
    })
  }

  handleChange(field, e) {
    const state = {}
    state[field] = e.target.value
    this.setState(state)
  }

  handleOk (e) {
    this.setState({
      notSamePassword: false,
      isEmpty: false,
      isError: false,
    })
    const that = this
    if(!this.state.newPassword || this.state.length === 0) {
      this.setState({
        isEmpty: true
      })
      return
    }
    if(this.state.newPassword.length < 6 || this.state.newPassword.length > 12) {
      this.setState({
        isError: true
      })
      return
    }
    const isPass = this.state.newPassword.split("").every(item => {
      return ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'].indexOf(item) !== -1
    })
    if(!isPass) {
      this.setState({
        isError: true
      })
      return
    }
    if(this.state.newPassword === this.state.confirmPassword) {
      $.ajax({
        url: '/api/modifyPassword',
        method: 'post',
        data: {
          newPassword: this.state.newPassword,
          job_id: store.getState().job_id,
        },
        success(responseData) {
          if(responseData.success) {
            that.setState({
              showModal: false,
            })
            message.success('修改成功')
          } else {
            message.error('修改失败')
          }
        }
      })
    } else {
      that.setState({
        notSamePassword: true
      })
    }
  }

  handleCancel (e) {
    this.setState({
      showModal: false,
    })
  }

  exit() {
    store.dispatch(logout())
  }

  render() {
    // console.log('header render',store.getState().hasLoggedIn)
    let hasLoggedIn = !(this.props.userName === '')
    let menu;
    if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
      menu = (
        <ul>
          {hasLoggedIn ? null : <li>欢迎！</li>}
          {hasLoggedIn ? <canvas ref="canvas" id="canvas" width="30px" height="30px" onClick={this.clickMenu.bind(this)}></canvas> : null}
        </ul>
      )
    } else {
      menu = (
        <ul>
          {hasLoggedIn ? null : <li>欢迎！</li>}
          {hasLoggedIn ? <li><a href="#">你好，{store.getState() ? store.getState().userName : ''}</a></li> : null}
          {hasLoggedIn ? <li><Link to='/' onClick = {this.exit.bind(this)}>退出</Link></li> : null}
          {hasLoggedIn ? <li><a href='#' onClick = {this.showModal.bind(this)}>修改密码</a></li> : null}
          <Modal
            title="修改密码"
            visible={this.state.showModal}
            onOk={this.handleOk.bind(this)}
            onCancel={this.handleCancel.bind(this)}
            okText="确认"
            cancelText="取消"
          >
            <Form>
              {this.state.isEmpty ? <span style={{color: 'red'}}>密码不得为空</span> : null}
              {this.state.isError ? <span style={{color: 'red'}}>密码长度或者输入的字符不符合格式</span> : null}
              {this.state.notSamePassword ? <span style={{color: 'red'}}>密码不一致，请重新输入</span> : null}
              <Form.Item>
                <Input.Password placeholder="新密码(长度在6-12之间，只能使用数字和字母)" value={this.state.newPassword} onChange={this.handleChange.bind(this, 'newPassword')}/>
              </Form.Item>
              <Form.Item>
                <Input.Password placeholder="密码确认" value={this.state.confirmPassword} onChange={this.handleChange.bind(this, 'confirmPassword')}/>
              </Form.Item>
            </Form>
          </Modal>
        </ul>
      )
    }
    return(
      <header id="newVistor">
          <Row>
            <Col span = {1}></Col>
            <Col span = {1}>
              <img ref='img'id='icon' src='images/schoolBadge.png' alt='西北大学'/>
            </Col>
            <Col span = {6}>
              <p>信息学院教学管理系统</p>
            </Col>
            <Col span = {15}>
            {menu}
            {this.state.showMenu ? (<ul id='menu'>
                                      <li onClick={this.clickMenu.bind(this)}><Link to='#' onClick={this.props.exit}>退出</Link></li>
                                    </ul>)
                                  : null}
            </Col>
            <Col span = {1}></Col>
          </Row>  
      </header>
    )
  }
}

const mapStateToProps = state => {
  let {userName, level} = state
  return {userName, level}
}
const Header = connect(
  mapStateToProps,
)(VHeader)

export default Header