import React, { Component } from 'react'
import {Input, Form} from 'antd'
import EditableContext from './Context.js'
const FormItem = Form.Item
class EditableCell extends Component {
  constructor(props) {
    super(props)
  }
  getInput() {
    return <Input />
  }
  render() {
    const {
      editing,
      dataIndex,
      title,
      record,
      index,
      notNullColumns,
      ...restProps
    } = this.props
    const notRequiredColum = notNullColumns
    // console.log('this.props dataIndex',dataIndex, notRequiredColum)
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: notRequiredColum.indexOf(dataIndex) !== -1,
                      message: `必填`,
                    }],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    )
  }
}

export default EditableCell