import { Menu, Icon } from 'antd';
import React, { Component } from 'react'

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class Sider extends Component {
  constructor(props) {
    super(props)
  }
  handleClick (e) {
    // console.log('click ', e)
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
          <Menu.Item key="mooc">MOOC</Menu.Item>
          <Menu.Item key="textbook">教材</Menu.Item>
          <Menu.Item key="top_teacher">教学名师</Menu.Item>
          <Menu.Item key="instruct_student_innovate">指导大学生创新</Menu.Item>
          <Menu.Item key="teach_reformation">教改项目</Menu.Item>
          <Menu.Item key="teach_award">教学获奖</Menu.Item>
          <Menu.Item key="teach_paper">教学论文</Menu.Item>
          <Menu.Item key="teach_model_center">教学示范中心</Menu.Item>
          <Menu.Item key="teach_team">教学团队</Menu.Item>
          <Menu.Item key="excellent_course">精品课程</Menu.Item>
          <Menu.Item key="7">竞赛</Menu.Item>
          <Menu.Item key="instruct_student_match">竞赛获奖</Menu.Item>
          <Menu.Item key="major">专业</Menu.Item>
        </SubMenu>
        <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>本科教育</span></span>}>
          <Menu.Item key="class_tbl">班级</Menu.Item>
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
