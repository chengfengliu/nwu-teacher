import React, { Component } from 'react'
import $ from 'jquery'
import XLSX from 'xlsx'
import '../../../../css/rulesTable.css'
import EditableCell from './EditableCell.js'
import EditableContext from './Context.js'
import { Table, Popconfirm, Button, message } from 'antd'

class RulesTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: [],
      data: [
        // {
        //   project_level: '国家',
        //   workload: '60',
        //   performance_score: '5',
        //   bonus: '5000',
        //   key: '0',
        // },
        // {
        //   project_level: '省级',
        //   workload: '60',
        //   performance_score: '3',
        //   bonus: '3000',
        //   key: '1',
        // },
        // {
        //   project_level: '校级',
        //   workload: '60',
        //   performance_score: '1',
        //   bonus: '500',
        //   key: '2',
        // },
      ], // 此页数据
      editingKey: '',
      table: props.table,
    }
  }

  componentWillReceiveProps(nextProps) {
    // console.log('componentWillReceiveProps',nextProps)
    this.setState({
      table: nextProps.table
    })
    if(nextProps.table !== this.state.table) {
      const that = this
      $.ajax({
        url: `/api/${nextProps.table}/getRules`,
        method: 'get',
        success(responseData) {
          // console.log('getRules',responseData)
          that.setState({
            table: nextProps.table,
            data: [],
            columns: responseData.concat(
              {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record) => { // render函数，这一列不用数据就直接渲染出来，参数分别为当前行的值，当前行数据
                  const { editingKey } = that.state
                  const editable = that.isEditing(record)
                  return (
                    <div>
                      {editable ? (
                        <span>
                          <EditableContext.Consumer>
                            {form => (
                              <a
                                href="javascript:;"
                                onClick={() => that.save(form, record.key)}
                                style={{ marginRight: 8 }}
                              >
                                保存
                              </a>
                            )}
                          </EditableContext.Consumer>
                          <Popconfirm
                            title="确定取消？"
                            okText="是" 
                            cancelText="否"
                            onConfirm={() => that.cancel(record.key)}
                          >
                            <a>取消</a>
                          </Popconfirm>
                        </span>
                      ) : (
                        <div>
                          <a disabled={editingKey !== ''} onClick={() => that.edit(record.key)} style={{marginRight: '5px'}}>编辑</a>
                          <a disabled={editingKey !== ''} onClick={() => that.delete(record.key)}>删除</a>
                        </div>
                      )}
                    </div>
                  )
                },
              }
            )
          })
        }
      })
    }
  }
  
  componentDidMount() {
    // console.log('compoentDidMount',this.state.table)
    const that = this
    $.ajax({
      url: `/api/${this.state.table}/getRules`,
      method: 'get',
      success(responseData) {
        // console.log('getRules',responseData)
        that.setState({
          columns: responseData.concat(
            {
              title: '操作',
              dataIndex: 'operation',
              render: (text, record) => { // render函数，这一列不用数据就直接渲染出来，参数分别为当前行的值，当前行数据
                const { editingKey } = that.state
                const editable = that.isEditing(record)
                return (
                  <div>
                    {editable ? (
                      <span>
                        <EditableContext.Consumer>
                          {form => (
                            <a
                              href="javascript:;"
                              onClick={() => that.save(form, record.key)}
                              style={{ marginRight: 8 }}
                            >
                              保存
                            </a>
                          )}
                        </EditableContext.Consumer>
                        <Popconfirm
                          title="确定取消？"
                          okText="是" 
                          cancelText="否"
                          onConfirm={() => that.cancel(record.key)}
                        >
                          <a>取消</a>
                        </Popconfirm>
                      </span>
                    ) : (
                      <div>
                        <a disabled={editingKey !== ''} onClick={() => that.edit(record.key)} style={{marginRight: '5px'}}>编辑</a>
                        <a disabled={editingKey !== ''} onClick={() => that.delete(record.key)}>删除</a>
                      </div>
                    )}
                  </div>
                )
              },
            }
          )
        })
      }
    })
  }

  isEditing(record) {
    return record.key === this.state.editingKey
  }

  addRules() {
    const editingRow = {
      key: 'add',
    }
    this.state.columns.forEach(item => {
      if(item.dataIndex !== "operation") {
        editingRow[item.dataIndex] = null
      }
    })
    this.setState(preState => ({
      data: preState.data.concat(editingRow),
      editingKey: 'add',
    }))
  }

  cancel() {
    if(this.state.editingKey === 'add') {
      this.setState(preState => ({editingKey: '', data: preState.data.slice(0, -1), isAdding: false}))
    } else {
      this.setState({ editingKey: '' })
    }
  }

  save(form, key) {
    const that = this
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      if(that.state.editingKey === 'add') {
        // 增加后的保存           
        message.success('添加成功')
        row.key = that.state.data.length - 1
        that.setState(preState => ({ editingKey: '', data: preState.data.slice(0, -1).concat(row), isAdding: false}))   
      } else {
        // 编辑后的保存
        const newData = [...that.state.data]
        const index = newData.findIndex(item => key === item.key)
        if (index > -1) {
          const item = newData[index];
          newData.splice(index, 1, {
            ...item,
            ...row,
          })
          that.setState({ data: newData, editingKey: '' });
        }     
      }
    })
  }

  edit(key) {
    this.setState({ editingKey: key })
  }

  delete(key) {
    const newData = [...this.state.data];
    const index = newData.findIndex(item => key === item.key)
    if (index > -1) {
      newData.splice(index, 1)
      this.setState({ data: newData, hadRolledBack: false})
    }
  }

  download() {
    $.ajax({
      url: `/api/${this.state.table}/computeAndDownload`,
      method: 'post',
      data: {
        rules: this.state.data
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
    // console.log('RulesTable render')
    const columns = this.state.columns.map(col => {
      if (!col.editable) {
        return col
      }
      return {
        ...col,
        // 设置单元格属性（传入EditableCell中）
        onCell: record => ({
          record,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
          notNullColumns: [],
        }),
      }
    })
    const components = {
      body: {
        cell: EditableCell
      }
    }
    return (
      <div id='rulesTable'>
        <Table
          components={components}
          columns={columns}
          dataSource={this.state.data}
          pagination={false}
        > 
        </Table>
        <Button className="addButton" type="primary" icon="export" onClick={this.download.bind(this)}>计算导出</Button>
        <Button className="addButton" type="primary" icon="plus" onClick={this.addRules.bind(this)}>添加</Button> 
      </div>
    )
  }
} 
export default RulesTable