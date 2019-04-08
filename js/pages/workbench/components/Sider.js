import { Menu, Icon } from 'antd';
import React, { Component } from 'react'

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class Sider extends Component {
  constructor(props) {
    super(props)
  }
  handleClick (e) {
    console.log('click ', e)
    this.props.changeTable(e.key)
  }

  render() {
    return (
      <Menu
        onClick={this.handleClick.bind(this)}
        style={{ width: 200 }}
        mode="inline"
      >
        <SubMenu key="sub1" title={<span><Icon type="mail" /><span>教学成果</span></span>}>
          <MenuItemGroup key="g1" title="Item 1">
            <Menu.Item key="mooc">MOOC</Menu.Item>
          </MenuItemGroup>
          <MenuItemGroup key="g2" title="Item 2">
            <Menu.Item key="3">Option 3</Menu.Item>
            <Menu.Item key="4">Option 4</Menu.Item>
          </MenuItemGroup>
        </SubMenu>
        <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>本科教育</span></span>}>
          <Menu.Item key="5">Option 5</Menu.Item>
          <Menu.Item key="6">Option 6</Menu.Item>
          <SubMenu key="sub3" title="Submenu">
            <Menu.Item key="7">Option 7</Menu.Item>
            <Menu.Item key="8">Option 8</Menu.Item>
          </SubMenu>
        </SubMenu>
        <SubMenu key="sub4" title={<span><Icon type="setting" /><span>基本信息</span></span>}>
          <Menu.Item key="9">Option 9</Menu.Item>
          <Menu.Item key="10">Option 10</Menu.Item>
          <Menu.Item key="11">Option 11</Menu.Item>
          <Menu.Item key="12">Option 12</Menu.Item>
        </SubMenu>
      </Menu>
    );
  }
}
export default Sider
