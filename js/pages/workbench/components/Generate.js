import React, { Component } from 'react'
import { Form, Input, Button } from 'antd'
import $ from 'jquery'
import XLSX from 'xlsx'
import '../../../../css/generate.css'
class Generate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      job_id: ''
    }
  }
  handleInput(e) {
    this.setState({
      job_id: e.target.value
    })
  }
  generate() {
    $.ajax({
      method: 'post',
      url: '/api/generate',
      data: {
        job_id: this.state.job_id
      },
      success(responseData) {
        // 将数组转化为xlsx文件
        const wbout = XLSX.write(responseData, {type:"array", bookType:'xlsx'})
        const blob = new Blob([wbout], {type: 'application/octet-stream'})
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.target = '_blank'
        link.download = '工作量表.xlsx'
        link.click()
        link.remove()
      }
    })
  }
  render() {
    return (
      <div id="generate">
        <Form.Item>
         <Input placeholder="工号" value={this.state.job_id} onChange={this.handleInput.bind(this)}/>
        </Form.Item>
        <Form.Item>
         <Button onClick={this.generate.bind(this)}>生成</Button>
        </Form.Item>
      </div>
    )
  }
}
export default Generate