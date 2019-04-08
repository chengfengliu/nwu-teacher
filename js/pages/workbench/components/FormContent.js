import React, { Component } from 'react'
import $ from 'jquery'
import '../../../../css/content.css'
import EditableCell from './EditableCell.js'
import { Pagination, Table, Popconfirm, Form, notification, Button, Icon, message, Upload } from 'antd'
import EditableContext from './Context.js'
import '../../../../css/formContent.css'
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
      isAdding: false // 是否正在添加
    }
  }
  componentWillReceiveProps(nextProps) {
    // console.log('componentWillReceiveProps',nextProps.table,this.state.page)
    if(nextProps.table !== '' && nextProps.table !== this.state.table) {
      const that = this
      $.ajax({
        // 请求表的页数
        url: '/api/getPageCount',
        type: 'post',
        data: {
          table: nextProps.table
        },
        success(responsePageCount) {
          // console.log('responsePageCount.pageCount',responsePageCount.pageCount)
          $.ajax({
            // 请求表第一页的数据
            url: `/api/get${nextProps.table}Item`,
            type: 'post',
            data: {
              page: that.state.page
            },
            success(responseData) {
              // console.log('getItem',responseData.data)
              responseData.data.forEach(item => {
                item.key = item.id
              })
              that.setState({
                pageCount: responsePageCount.pageCount,
                table: nextProps.table,
                data: responseData.data,
                columns: [
                  {
                    title: '课程名',
                    dataIndex: 'course_name',
                    editable: true
                  },
                  {
                    title: '课程级别',
                    dataIndex: 'course_level',
                    editable: true
                  },
                  {
                    title: '主持人工号',
                    dataIndex: 'director_job_id',
                    editable: true,
                  },
                  {
                    title: '成员',
                    dataIndex: 'member',
                    editable: true,
                  },
                  {
                    title: '是否在线',
                    dataIndex: 'is_online',
                    editable: true,
                  },
                  {
                    title: '时间',
                    dataIndex: 'time',
                    editable: true,
                  },
                  {
                    title: '备注',
                    dataIndex: 'remark',
                    editable: true,
                  },
                  {
                    title: '绩效计分',
                    dataIndex: 'performance_scroe',
                    editable: true,
                  },
                  {
                    title: '奖金',
                    dataIndex: 'bonus',
                    editable: true,
                  },
                  {
                    title: '工作量',
                    dataIndex: 'workload',
                    editable: true,
                  }, 
                  {
                    title: '操作',
                    dataIndex: 'operation',
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
                ]
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
      url: `/api/get${this.state.table}Item`,
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
          // 增加数据
          if(responseData.data.length === 10) {
            // 最后一页数据已到达10条
            // console.log('another page')
            responseData.data = []
            responseData.data.push({
              bonus:null,
              course_level: null,
              course_name: null,
              director_job_id: null,
              is_online: null,
              key: "add",
              member: null,
              performance_scroe: null,
              remark: null,
              time: null,
              workload: null
            })
            that.setState({
              page: page + 1,
              pageCount: page + 1,
              data: responseData.data,
              editingKey: 'add'
            })
          } else {
            responseData.data.push({
              bonus:null,
              course_level: null,
              course_name: null,
              director_job_id: null,
              is_online: null,
              key: "add",
              member: null,
              performance_scroe: null,
              remark: null,
              time: null,
              workload: null
            })
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
      // console.log('row',row,'key',key)
      if(this.state.editingKey === 'add') {
        $.ajax({
          url: `/api/add${that.state.table}Item`,
          type: 'post',
          data: {
            course_name: row.course_name,
            course_level: row.course_level,
            director_job_id: row.director_job_id,
            member: row.member,
            is_online: row.is_online,
            time: row.time,
            remark: row.remark,
            performance_scroe: row.performance_scroe,
            bonus: row.bonus,
            workload: row.workload
          },
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
        $.ajax({
          url: `/api/edit${that.state.table}Item`,
          type: 'post',
          data: {
            id: key, 
            course_name: row.course_name,
            course_level: row.course_level,
            director_job_id: row.director_job_id,
            member: row.member,
            is_online: row.is_online,
            time: row.time,
            remark: row.remark,
            performance_scroe: row.performance_scroe,
            bonus: row.bonus,
            workload: row.workload
          },
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
            }
          }
        })
      }
    })
  }
  delete(key) {
    const that = this
    $.ajax({
      url: `/api/remove${that.state.table}Item`,
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
            if(newData.length === 0) {
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
        url: `/api/commit${that.state.table}Item`,
        type: 'get',
        success(responseData) {
          // console.log(responseData)
        }
      })
    }
  }
  rollback(index, row, notificationKey) {
    notification.close(notificationKey)
    // console.log('rollback index',index,row,notificationKey)
    const that = this
    $.ajax({
      url: `/api/rollback${that.state.table}Item`,
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
    window.open("/api/downloadmoocItem")
  }
  render() {
    // console.log('render','this.state.data',this.state.data)
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
        }),
      }
    })
    const components = {
      body: {
        cell: EditableCell
      }
    }
    const uploadProps = {
      name: 'file',
      action: '/api/uploadmoocItem',
      onChange(info) {
        console.log('info',info.file.status,info)
        if (info.file.status !== 'uploading') {
          // console.log(info.file, info.fileList)
        }
        if (info.file.status === 'done' && info.file.response.success) {
          message.success(`${info.file.name} 文件上传成功`)
        } else if (info.file.status === 'done' && !info.file.response.success && info.file.response.requiredFieldNull) {
          message.error(`${info.file.name} 文件上传成功(部分记录必填项为空，未录入)`)
        } else if (info.file.status === 'done' && !info.file.response.success) {
          message.error(`${info.file.name} 文件上传失败`)
        }
      },
    }
    // console.log('columns',columns)
    return (
      <div id="content">
        <EditableContext.Provider value={this.props.form}>
          <Table components={components} 
                 columns={columns} 
                 dataSource={this.state.data} 
                 pagination={false} 
                 rowClassName={record => {
                  if(record.addRow) {
                    return "addRow"
                  }
                 }}
          />
          {this.state.table !== '' ? <Pagination className="contentPagination" current={this.state.page} defaultCurrent={this.state.page} total={this.state.pageCount * 10} onChange={this.onChange.bind(this)} /> : null}
          {this.state.table !== '' ? <Button className="addButton" type="primary" icon="download" onClick={this.download.bind(this)}>导出</Button> : null}
          {this.state.table !== '' ? <Upload className= "uploadButton" {...uploadProps}><Button type="primary" icon="upload">导入</Button></Upload> : null}
          {this.state.table !== '' ? <Button className="addButton" type="primary" icon="plus" onClick={this.add.bind(this)}>添加</Button> : null}
        </EditableContext.Provider>
      </div>

    )
  }
}
const FormContent = Form.create()(Content)
export default FormContent