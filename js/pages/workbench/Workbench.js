import React, { Component } from 'react'
import { Layout, Row, Col } from 'antd'
import Header from '../../components/Header.js'
import Footer from '../../components/Footer.js'
import Sider from './components/Sider.js'
import Generate from './components/Generate.js'
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
    // console.log('Workbench render',this.state.table)
    return (
      <Layout>
        <Header />
        <Row>
          {/* <Col span={1}></Col> */}
          <Col span={4}><Sider changeTable={this.changeTable.bind(this)}/></Col>
          {this.state.table === 'generate' ? 
          <Col span={20}><Generate/></Col> :
          <Col span={20}><FormContent table={this.state.table} selectedRowKeys={[]}/></Col>
          }
          {/* <Col span={1}></Col> */}
        </Row>              
        <Footer />
      </Layout>
    )
  }
}

export default Workbench