import React, { Component } from 'react'
import {Form, Icon, Input, Button} from 'antd'
class LoginFrom extends Component {
  constructor(props) {
    super(props)
    this.state = {
      job_id: '',
      password: ''
    }
  }
  updateField(field, e) {
    const state = {}
    state[field] = e.target.value
    this.setState(state)
  }
  handleSubmit(e) {
    e.preventDefault()
    this.props.onPost({
      job_id: this.state.job_id,
      password: this.state.password
    })
  }
  render() {
    return(
          <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
            <Form.Item>
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="工号" onChange={this.updateField.bind(this, 'job_id')} value={this.state.job_id}/>
            </Form.Item>
            <Form.Item>
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" onChange={this.updateField.bind(this, 'password')} value={this.state.password}/>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }} className="login-form-button">
                登录
              </Button>
            </Form.Item>
          </Form>
    )
  }
}

export default LoginFrom