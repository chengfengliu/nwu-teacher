import React, { Component } from 'react'
import $ from 'jquery'
import { Layout, Row, Col } from 'antd'
import Header from '../../components/Header.js'
import Footer from '../../components/Footer.js'
import Sider from './components/Sider.js'
import FormContent from './components/FormContent.js'
class Workbench extends Component { 
  constructor(props) {
    super(props)
    this.state = {
      table: ''
    }
  }
  changeTable(key) {
    this.setState({
      table: key
    })
  }
  render() {
    return (
      <Layout>
        <Header />
        <Row>
          <Col span={1}></Col>
          <Col span={4}><Sider changeTable={this.changeTable.bind(this)}/></Col>
          <Col span={18}><FormContent table={this.state.table}/></Col>
          <Col span={1}></Col>
        </Row>              
        <Footer />
      </Layout>
    )
  }
}

export default Workbench