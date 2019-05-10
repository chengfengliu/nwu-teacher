import React, { Component } from 'react'
import $ from 'jquery'
import '../../../../css/content.css'
import '../../../../css/formContent.css'
import EditableCell from './EditableCell.js'
import EditableContext from './Context.js'
import RulesTable from './RulesTable.js'
import { Pagination, Table, Popconfirm, Form, notification, Button, Icon, message, Upload } from 'antd'

class Content extends Component { 
  constructor(props) {
    super(props)
    this.state = {
      table: '', // 当前表格
      page: 1, // 当前页数
      pageCount: 1, // 总页数
      data: [], // 此页数据
      columns: [], // 表格列
      editingKey: '', // 正在编辑的单元行
      hadRolledBack: false, // 是否已撤销
      isAdding: false, // 是否正在添加
      selectedRowKeys: [], // 正在选择的行
    }
  }

  componentWillReceiveProps(nextProps) {
    // console.log('FormContent componentWillReceiveProps nextProps.table:',nextProps.table,this.state.table)
    if(nextProps.table !== '' && nextProps.table !== this.state.table) {
      const that = this
      $.ajax({
        // 请求表的页数
        url: '/api/getPageCountAndColumns',
        type: 'post',
        data: {
          table: nextProps.table
        },
        success(responsePageCountAndColumns) {
          $.ajax({
            // 请求表第一页的数据
            url: `/api/${nextProps.table}/getItem`,
            type: 'post',
            data: {
              page: that.state.page
            },
            success(responseData) {
              // console.log('getItem')
              responseData.data.forEach(item => {
                item.key = item.id
              })
              responsePageCountAndColumns.columns.push(
                {
                  title: '操作',
                  dataIndex: 'operation',
                  fixed: nextProps.table === 'instruct_student_innovate' || nextProps.table === 'instruct_student_match' ? 'right' : null,
                  render: (text, record) => { // 参数分别为当前行的值，当前行数据
                    const { editingKey } = that.state
                    // console.log('record',record)
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
                },
              )
              that.setState({
                pageCount: responsePageCountAndColumns.pageCount,
                page: 1,
                table: nextProps.table,
                selectedRowKeys: nextProps.selectedRowKeys,
                data: responseData.data,
                columns: responsePageCountAndColumns.columns,
              })
            }
          })
        }
      })
     
    }
  }

  onChange(page) {
    // console.log('onChange')
    const that = this
    $.ajax({
      url: `/api/${this.state.table}/getItem`,
      type: 'post',
      data: {
        page
      },
      success(responseData) {
        // console.log('getItem',responseData.data)
        responseData.data.forEach(item => {
          item.key = item.id
        })
        if(that.state.isAdding) {
          // 正在增加数据
          const editingRow = {
            key: 'add',
          }
          that.state.columns.forEach(item => {
            if(item.dataIndex !== "operation") {
              editingRow[item.dataIndex] = null
            }
          })
          console.log('editingRow', editingRow)
          if(responseData.data.length === 10) {
            // 最后一页数据已到达10条
            responseData.data = []
            responseData.data.push(editingRow)
            that.setState({
              page: page + 1,
              pageCount: page + 1,
              data: responseData.data,
              editingKey: 'add'
            })
          } else {
            responseData.data.push(editingRow)
            that.setState({
              page: page,
              data: responseData.data,
              editingKey: 'add'
            })
          }
        } else {
          that.setState({
            page: page,
            data: responseData.data
          })
        }
      }
    })
  }

  isEditing(record) {
    return record.key === this.state.editingKey
  }

  cancel() {
    if(this.state.editingKey === 'add') {
      if(this.state.data.length === 1) {
        this.onChange(this.state.pageCount - 1)
        this.setState({ editingKey: '', data: this.state.data.slice(0, -1), isAdding: false, pageCount: this.state.pageCount - 1})
      } else {
        this.setState({ editingKey: '', data: this.state.data.slice(0, -1), isAdding: false})
      }
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
      // console.log('row', row, 'key', key, this.state.editingKey)
      if(this.state.editingKey === 'add') {
        $.ajax({
          url: `/api/${that.state.table}/addItem`,
          type: 'post',
          data: row,
          success(responseData) {
            // console.log('resData',responseData)
            if(responseData.success) {
              const newData = [...that.state.data]
              const index = newData.findIndex(item => key === item.key)
              const item = newData[index]
              row.id = responseData.newItemId
              row.key = responseData.newItemId
              row.addRow = true
              newData.splice(index, 1, {
                ...item,
                ...row,
              })
              // console.log('newData', newData)
              message.success('添加成功')
              that.setState({ editingKey: '', data: newData, isAdding: false})
            } else {
              message.error('添加失败')
              that.setState({ editingKey: '', data: that.state.data.slice(0, -1), isAdding: false})
            }
          }
        })
      } else {
        row.id = key
        $.ajax({
          url: `/api/${that.state.table}/editItem`,
          type: 'post',
          data: row,
          success(responseData) {
            // console.log('resData',responseData)
            if(responseData.success) {
              const newData = [...that.state.data]
              const index = newData.findIndex(item => key === item.key)
              if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                  ...item,
                  ...row,
                })
                // console.log('index',index,'item',item,'row',row,'newData',newData)
                that.setState({ data: newData, editingKey: '' });
              } else {
                newData.push(row);
                that.setState({ data: newData, editingKey: '' });
              }
            } else {
              message.error('编辑失败（格式不正确）')
            }
          }
        })
      }
    })
  }

  delete(key) {
    const that = this
    $.ajax({
      url: `/api/${that.state.table}/removeItem`,
      type: 'post',
      data: {
        id: key
      },
      success(responseData) {
        // console.log('remove',responseData)
        if(responseData.success) {
          const newData = [...that.state.data];
          const index = newData.findIndex(item => key === item.key)
          if (index > -1) {
            const row = newData.splice(index, 1)
            // console.log('row',row)
            if(newData.length === 0 && that.state.page === 1) {
              // 最后一页也是第一页删除唯一的一行
              that.setState({data: []})
            } else if (newData.length === 0) {
              // 最后一页删除唯一的一行
              that.onChange(that.state.page - 1)
              that.setState({pageCount: that.state.pageCount - 1})
            } else {
              that.setState({ data: newData, hadRolledBack: false})
            }
            const notificationKey = `open${Date.now()}`
            const btn = (
              <Button type="primary" size="small" onClick={() => that.rollback(index, row[0], notificationKey)}>
                撤销
              </Button>
            )
            notification.open({
              message: '删除成功',
              btn,
              key: notificationKey,
              duration: 3,
              onClose: that.commit.bind(that),
              icon: <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
            })
          } 
        } else {
          notification.open({
            message: '删除失败',
            key,
            duration: 3,
            icon: <Icon type="close-circle" theme="twoTone" twoToneColor="red" />
          })
        }
      }
    })
  }

  commit() {
    if(!this.state.hadRolledBack) {
      // console.log('commit')
      const that = this
      $.ajax({
        url: `/api/commit`,
        type: 'get',
      })
    }
  }
  
  rollback(index, row, notificationKey) {
    notification.close(notificationKey)
    // console.log('rollback index',index,row,notificationKey)
    const that = this
    $.ajax({
      url: `/api/rollback`,
      type: 'get',
      success(responseData) {
        if(responseData.success) {
          const newData = [...that.state.data]
          if (index > -1) {
            newData.splice(index, 0, row)
            // console.log('index',index,'item',item,'row',row,'newData',newData)
            that.setState({data: newData, hadRolledBack: true})
            message.success('撤销成功')
          } else {
            message.error('撤销失败')
          }
        }
      }
    })
  }

  edit(key) {
    this.setState({ editingKey: key })
  }

  add() {
    // console.log(this.state.data.length,'pageCount',this.state.pageCount)
    this.setState({page: this.state.pageCount, isAdding: true})
    this.onChange(this.state.pageCount)
  }

  download() {
    window.open(`/api/${this.state.table}/downloadItem`)
  }

  downloadTemplate() {
    window.open(`/api/${this.state.table}/downloadTemplate`)
  }

  deleteSelectedRows() {
    // console.log('deleteSelectedRows',this.state.selectedRowKeys)
    message.loading('正在删除中', 0)
    const that = this
    $.ajax({
      url: `/api/${this.state.table}/deleteSelectedRows`,
      method: 'post',
      data: {
        selectedRowKeys: this.state.selectedRowKeys
      },
      success(responseData) {
        if (responseData.success) {
          message.destroy()
          message.success('删除成功')
          that.onChange(that.state.page)
          that.setState({
            pageCount: responseData.pageCount,
            selectedRowKeys: []
          })
        } else {
          message.destroy()
          message.error('删除失败')
        }
      }
    })
  }

  render() {
    // console.log('FormContent render','this.state.table',this.state.table)
    const notNullColumns = []
    this.state.columns.forEach(item => {
      if(item.notNull) {
        notNullColumns.push(item.dataIndex)
      }
    })
    // console.log('notNullColumns',notNullColumns)
    const columns = this.state.columns.map((col) => {
      if (!col.editable) {
        return col
      }
      return {
        ...col,
        onCell: record => ({
          record,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
          notNullColumns: notNullColumns,
        }),
      }
    })
    const components = {
      body: {
        cell: EditableCell
      }
    }
    const that = this
    const uploadProps = {
      name: 'file',
      action: `/api/${this.state.table}/uploadItem`,
      onChange (info) {
        // console.log('info',info.file.status,info)
        if (info.file.status !== 'uploading') {
           //console.log(info.file, info.fileList)
          }
        if (info.file.status === 'done' && info.file.response.success) {
          message.success(`${info.file.name} 文件上传成功`)
          that.setState({
            pageCount: info.file.response.pageCount,
          })
          that.onChange(info.file.response.pageCount)
        } else if (info.file.status === 'done' && !info.file.response.success && info.file.response.requiredFieldNull) {
          message.error(`${info.file.name} 文件上传失败(部分记录必填项为空)`)
        } else if (info.file.status === 'done' && !info.file.response.success && info.file.response.formatErr) {
          message.error(`${info.file.name} 文件上传失败(部分记录格式错误)`)
        } else if (info.file.status === 'done' && !info.file.response.success) {
          message.error(`${info.file.name} 文件上传失败`)
        }
        if (info.file.status === 'error') {
          message.error(`${info.file.name} 文件上传失败`)
        }
      },
    }
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        // console.log(`selectedRowKeys: ${selectedRowKeys}`,typeof selectedRowKeys, 'selectedRows: ', selectedRows)
        this.setState({
          selectedRowKeys
        })
      },
    }
    // console.log('columns',columns)
    return (
      <div id="content">
        <EditableContext.Provider value={this.props.form}>
          {this.state.table === 'instruct_student_innovate' || this.state.table === 'instruct_student_match' ?
            <Table rowSelection={this.state.table !== '' ? rowSelection : null}
                    components={components} 
                    columns={columns} 
                    dataSource={this.state.data} 
                    pagination={false} 
                    rowClassName={record => {
                    if(record.addRow) {
                      return "addRow"
                    }
                    }}
                    scroll={{ x: 3000 }}
            /> :
            <Table rowSelection={this.state.table !== '' ? rowSelection : null}
                    components={components} 
                    columns={columns} 
                    dataSource={this.state.data} 
                    pagination={false} 
                    rowClassName={record => {
                      if(record.addRow) {
                        return "addRow"
                      }
                    }}
              />
          }
          {this.state.table !== '' ? <Pagination className="contentPagination" current={this.state.page} defaultCurrent={this.state.page} total={this.state.pageCount * 10} onChange={this.onChange.bind(this)} /> : null}
          {this.state.table !== '' ? <Button className="addButton" type="primary" icon="export" onClick={this.download.bind(this)}>导出</Button> : null}
          {this.state.table !== '' ? <Upload className= "uploadButton" {...uploadProps}><Button type="primary" icon="import">导入</Button></Upload> : null}
          {this.state.table !== '' ? <Button className= "uploadButton" type="primary" icon="download" onClick={this.downloadTemplate.bind(this)}>下载模板</Button> : null}
          {this.state.table !== '' ? <Button className="addButton" type="primary" icon="plus" onClick={this.add.bind(this)}>添加</Button> : null}
          {this.state.table !== '' && this.state.selectedRowKeys.length !== 0 ? 
           <Popconfirm title="此操作无法撤销。确定删除？" onConfirm={this.deleteSelectedRows.bind(this)} okText="确定" cancelText="取消">
            <Button className="addButton" type="primary" icon="delete">一键删除</Button>
           </Popconfirm>
          : null}
          {this.state.table !== '' && this.state.table !== 'teacher_tbl' && this.state.table !== 'course_tbl' ? <RulesTable table={this.state.table}></RulesTable>: null}
        </EditableContext.Provider>
      </div>
    )
  }
}
const FormContent = Form.create()(Content)
export default FormContent