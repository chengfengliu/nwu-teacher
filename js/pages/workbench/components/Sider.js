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
      <div>
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
            {/* <Menu.Item key="7">竞赛</Menu.Item> */}
            <Menu.Item key="instruct_student_match">竞赛获奖</Menu.Item>
            <Menu.Item key="major">专业</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>本科教育</span></span>}>
            <Menu.Item key="course_workload_tbl">课程工作量</Menu.Item>
            <Menu.Item key="extra_job_workload_tbl">教师职务补贴工作量</Menu.Item>
            <Menu.Item key="internship_tbl">实习</Menu.Item>
            <Menu.Item key="internship_workload_tbl">实习工作量</Menu.Item>
            <Menu.Item key="gradproject_tbl">毕业设计</Menu.Item>
            {/* <Menu.Item key="corporate_mentor_tbl">企业导师</Menu.Item> */}
          </SubMenu>
          <SubMenu key="sub4" title={<span><Icon type="setting" /><span>基本信息</span></span>}>
            <Menu.Item key="teacher_tbl">老师信息表</Menu.Item>
            <Menu.Item key="course_tbl">课程</Menu.Item>
          </SubMenu>
        </Menu>

        <Menu
          onClick={this.handleClick.bind(this)}
          style={{ width: 200, marginTop: 50 }}
          mode="inline"
        >
          <Menu.Item key="generate">生成老师总汇表</Menu.Item>
        </Menu>
      </div>
    )
  }
}
export default Sider
