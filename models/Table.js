/// <reference path="../js/pages/workbench/components/Sider.js" />
const xlsx = require('node-xlsx')
const send = require('koa-send')

const path = require('path')
const fs = require('fs')

// 连接MySQL数据库
const mysql = require('mysql')
const mysqlConfig = require('../mysqlConfig')
const connection = mysql.createConnection(mysqlConfig)

const Mooc = require('./Mooc.js')
const Textbook = require('./Textbook.js')
const TopTeacher = require('./TopTeacher.js')
const InstructStudentInnovate = require('./InstructStudentInnovate.js')
const TeachReformation = require('./TeachReformation.js')
const TeachAward = require('./TeachAward.js')
const TeachPaper = require('./TeachPaper.js')
const TeachModelCenter = require('./TeachModelCenter.js')
const TeachTeam = require('./TeachTeam.js')
const ExcellentCourse = require('./ExcellentCourse.js')
const Major = require('./Major.js')
const InstructStudentMatch = require('./InstructStudentMatch.js')
const ClassTbl = require('./ClassTbl.js')
const CourseWorkloadTbl = require('./CourseWorkloadTbl.js')
const CourseTbl = require('./CourseTbl.js')
const CorporateMentorTbl = require('./CorporateMentorTbl.js')
const ExtraJobWorkloadTbl = require('./ExtraJobWorkloadTbl.js')
const GradprojectTbl = require('./GradprojectTbl.js')
const InternshipBaseTbl = require('./InternshipBaseTbl.js')
const InternshipTbl = require('./InternshipTbl.js')
const InternshipWorkloadTbl = require('./InternshipWorkloadTbl.js')


const publicTable = [
    {
        name: 'teacher_tbl', //表名
        idColumnName: 'job_id', //表的id名，将来会作为其他表的外键
    },
    {
        name: 'internship_tbl', 
        idColumnName: 'internship_id',
    },
]

const columns = {
  'mooc': Mooc.columns,
  'textbook': Textbook.columns,
  'top_teacher': TopTeacher.columns,
  'instruct_student_innovate': InstructStudentInnovate.columns,
  'teach_reformation': TeachReformation.columns,
  'teach_award': TeachAward.columns,
  'teach_paper': TeachPaper.columns,
  'teach_model_center': TeachModelCenter.columns,
  'teach_team': TeachTeam.columns,
  'excellent_course': ExcellentCourse.columns,
  'major': Major.columns,
  'instruct_student_match': InstructStudentMatch.columns,
  'class_tbl': ClassTbl.columns,
  'course_workload_tbl': CourseWorkloadTbl.columns,
  'course_tbl': CourseTbl.columns,
  'corporate_mentor_tbl': CorporateMentorTbl.columns,
  'extra_job_workload_tbl': ExtraJobWorkloadTbl.columns,
  'gradproject_tbl': GradprojectTbl.columns,
  'internship_base_tbl': InternshipBaseTbl.columns,
  'internship_tbl': InternshipTbl.columns,
  'internship_workload_tbl': InternshipWorkloadTbl.columns,
}

module.exports.getPageCountAndColumns = () => {
  return async(ctx, next) => {
    // console.log('getPageCountAndColumns',ctx.request.body)
    const {table} = ctx.request.body
    await new Promise(resolve => {
      connection.query(`SELECT count(*) FROM ${table}`, (err, result) => {
        if(err) {
          console.log(err)
          resolve()
          return
        }
        if(result.length !== 0) {
          // console.log('success', result)
          ctx.response.body = {
            "pageCount": Math.ceil(result[0]['count(*)'] / 10),
            "columns": columns[table],
          }
          resolve()
        }
      })
    })
    await next()
  }
}

module.exports.getItem = () => {
  return async(ctx, next) => {
    // console.log('getItem',ctx.request.body, 'param', ctx.params.table, typeof ctx.params.table, columns[ctx.params.table])
    let {page} = ctx.request.body
    page = parseInt(page) === 0 ? 1 : page
    // console.log('page',page)
      await new Promise(resolve => {

          const selectColumns = ['id']
          publicTable.forEach(item => {
              if (ctx.params.table === item.name) {
                  selectColumns[0] = `${item.idColumnName} as id`
              }
          })

      let sourceTable = '', primaryKey = '', foreignKey = ''
      columns[ctx.params.table].forEach(item => {
          if (!item.editable) {
              sourceTable = item.sourceTable
              primaryKey = item.primaryKey
              foreignKey = item.foreignKey
              selectColumns.push(`${item.sourceTable}.${item.dataIndex}`)
          }
          else {
              selectColumns.push(`${ctx.params.table}.${item.dataIndex}`)
          }

          //selectColumns.push(item.dataIndex)
      })
      connection.query(`SELECT ${selectColumns.join(',')} FROM ${ctx.params.table}${sourceTable === '' ? '' : `,${sourceTable} WHERE ${ctx.params.table}.${primaryKey}=${sourceTable}.${foreignKey}`} LIMIT ${(page - 1) * 10}, 10;`, (err, result) => {
        if(err) {
          console.log(err)
          resolve()
          return
        }
        ctx.response.body = {
          "data": result
        }
        resolve()
      })
    })
    await next()
  }
}

// module.exports.getColumns = () => {
//   return async(ctx, next) => {
//     await new Promise(resolve => {
//       ctx.response.body = {
//         columns: columns[ctx.params.table],
//       }
//       resolve()
//     })
//     await next()
//   }
// }

module.exports.addItem = () => {
  return async(ctx, next) => {
    // console.log('addItem',ctx.request.body, typeof ctx.request.body.director_job_id, parseInt(ctx.request.body.director_job_id))
    // director_job_id客户端传来的是string，mysql会自动检测是否符合int
    await new Promise(resolve => {
      const selectColumns = []
      const columnsValue = []
      columns[ctx.params.table].forEach(item => {
        if(!item.editable) {
          return
        }
        selectColumns.push(item.dataIndex)
        // console.log(item.dataIndex, item.type)
        if (item.notNull && item.type === 'char') {
          columnsValue.push(`'${ctx.request.body[item.dataIndex]}'`)
        } else if (item.notNull && (item.type === 'int' || item.type === 'float')) {
          columnsValue.push(`${ctx.request.body[item.dataIndex]}`)
        } else if (!item.notNull && item.type === 'char') {
          columnsValue.push(`${ctx.request.body[item.dataIndex] ? `'${ctx.request.body[item.dataIndex]}'` : null}`)
        } else if (!item.notNull && (item.type === 'int' || item.type === 'float')) {
          columnsValue.push(`${ctx.request.body[item.dataIndex] ? `${ctx.request.body[item.dataIndex]}` : null}`)
        }
      })
      // console.log(columnsValue.join(','))
      connection.query(`INSERT INTO ${ctx.params.table} (${selectColumns.join(',')}) VALUES (${columnsValue.join(',')})`, (err, result) => {
        if(err) {
          console.log(err)
          ctx.response.body = {
            "success": false,
          }
          // Promise状态变为fulfilled，不用reject()因为需要在外部try...catch...很麻烦
          resolve()
          // 中断返回
          return
        }
        // console.log('result',result)
        if(result.affectedRows === 1) {
          // console.log('success')
          // 增加成功
          ctx.response.body = {
            "success": true,
            "newItemId": result.insertId
          }
          resolve()
        }
      })
    })
    await next()
  }
}

module.exports.editItem = () => {
  return async(ctx, next) => {
    // console.log(ctx.request.body)
    const {id} = ctx.request.body
    await new Promise(resolve => {
      const selectColumns = []
      const columnsValue = []
      columns[ctx.params.table].forEach(item => {
        if(!item.editable) {
          return
        }
        selectColumns.push(item.dataIndex)
        if (item.notNull && item.type === 'char') {
          columnsValue.push(`${item.dataIndex} = '${ctx.request.body[item.dataIndex]}'`)
        } else if (item.notNull && (item.type === 'int' || item.type === 'float')) {
          columnsValue.push(`${item.dataIndex} = ${ctx.request.body[item.dataIndex]}`)
        } else if (!item.notNull && item.type === 'char') {
          columnsValue.push(`${ctx.request.body[item.dataIndex] ? `${item.dataIndex} = '${ctx.request.body[item.dataIndex]}'` : `${item.dataIndex} = null`}`)
        } else if (!item.notNull && (item.type === 'int' || item.type === 'float')) {
          columnsValue.push(`${ctx.request.body[item.dataIndex] ? `${item.dataIndex} = ${ctx.request.body[item.dataIndex]}` : `${item.dataIndex} = null`}`)
        }
      })
      // console.log(columnsValue.join(','))
      // String转换成Number和变量不是NULL加引号
      connection.query(`UPDATE ${ctx.params.table} SET ${columnsValue.join(',')} WHERE id = ${id};`, (err, result) => {
        if(err) {
          console.log(err)
          ctx.response.body = {
            "success": false
          }
          resolve()
          return
        }
        // console.log('result',result) 
        if(result.length !== 0) {
          // console.log('success')
          // 修改成功
          ctx.response.body = {
            "success": true
          }
          resolve()
        }
      })
    })
    await next()
  }
}

module.exports.removeItem = () => {
  return async(ctx, next) => {
    // console.log(ctx.request.body)
    const {id} = ctx.request.body
    await new Promise(resolve => {
      // 事务
      connection.beginTransaction(transactionErr => {
        if (transactionErr) {
          console.log(transactionErr)
          resolve()
          return
        }
        connection.query(`DELETE FROM ${ctx.params.table} WHERE id = ${id};`, (err, result) => {
          // console.log('result',result.affectedRows)
          // id要转换
          if(err) {
            ctx.response.body = {
              "success": false
            }
            console.log(err)
            connection.rollback()
            resolve()
            return
          }
          if(result.affectedRows === 1) {
            ctx.response.body = {
              "success": true
            }
            resolve()
          } else {
            ctx.response.body = {
              "success": false
            }
            resolve()
          }
        })
      })
    })
    await next()
  }
}

module.exports.rollback = () => {
  return async(ctx, next) => {
    // console.log('rollback')
    await new Promise(resolve => {
      connection.rollback(err => {
        if(err) {
          console.log(err)
          ctx.response.body = {
            "success": false
          }
          resolve()
          return
        }
        ctx.response.body = {
          "success": true
        }
        resolve()
      })
    })
    await next()
  }
}

module.exports.commit = () => {
  return async(ctx, next) => {
    // console.log('commit')
    await new Promise(resolve => {
      connection.commit(err => {
        if(err) {
          console.log(err)
          ctx.response.body = {
            "success": false
          }
          resolve()
          return
        }
        // console.log('result', result)
        ctx.response.body = {
          "success": true
        }
        resolve()
      })
    })
    await next()
  }
}

module.exports.uploadItem = () => {
  return async(ctx, next) => {
    const file = ctx.req.file
    let requiredFieldNull = false, formatErr = false
    await new Promise(resolve => {
      // console.log('file', file, path.resolve(__dirname, '..', 'uploads', file.filename))
      const filePath = path.resolve(__dirname, '..', 'uploads', file.filename)
      const workSheets = xlsx.parse(filePath)
      // 删除表头
      workSheets[0].data.shift()
      // console.log('workSheets', workSheets,'data\n',workSheets[0].data)
      // 检查数据格式
      // 通过try提前结束forEach遍历
      try {
        const notNullIndexs = []
        const intAndFloatIndexs = []
        columns[ctx.params.table].forEach(item => {
          if(item.notNull) {
            notNullIndexs.push(item.templateIndex)
          }
          if(item.type === 'int' || item.type === 'float') {
            intAndFloatIndexs.push(item.templateIndex)
          }
        })
        // console.log('notNullIndexs', notNullIndexs,'intAndFloatIndexs',intAndFloatIndexs)
        workSheets[0].data.forEach(item => {
          // console.log('item',item)
          console.log('item',item[0], typeof item[0],item[0].length,item[1], typeof item[1],item[1].length,item[2],typeof item[2],item[3], typeof item[3],item[4], typeof item[4],item[5], typeof item[5],item[6], typeof item[6],item[7], typeof item[7],item[8], typeof item[8],item[9], typeof item[9],item[10], typeof item[10],notNullIndexs.every(index => item[index]))
          if(item.length !== 0 && !notNullIndexs.every(index => item[index])) {
            requiredFieldNull = true
            throw new Error('requiredFieldNull')
          }
          if(item.length !== 0 && !intAndFloatIndexs.every(index => typeof item[index] == 'number' || typeof item[index] == 'undefined')) {
            formatErr = true
            throw new Error('formatErr')
          }
        })
      } catch(e) {
        console.log(e.message)
        if(e.message === 'requiredFieldNull') {
          ctx.response.body = {
            "success": false,
            "requiredFieldNull": true,
          }
        } else if(e.message === 'formatErr') {
          ctx.response.body = {
            "success": false,
            "formatErr": true,
          }
        }
        resolve()
        return
      }
      // 通过检查后插入数据库
      workSheets[0].data.forEach(item => {
        if(item.length === 0) {
          return
        }
        console.log('item',item)
        const selectColumns = []
        const columnsValue = []
        columns[ctx.params.table].forEach(column => {
          if(!column.editable) {
            return
          }
          selectColumns.push(column.dataIndex)
          // console.log(column.dataIndex,column.type)
          if (column.notNull && column.type === 'char') {
            columnsValue.push(`'${item[column.templateIndex]}'`)
          } else if (column.notNull && (column.type === 'int' || column.type === 'float')) {
            columnsValue.push(`${item[column.templateIndex]}`)
          } else if (!column.notNull && column.type === 'char') {
            columnsValue.push(`${item[column.templateIndex] ? `'${item[column.templateIndex]}'` : null}`)
          } else if (!column.notNull && (column.type === 'int' || column.type === 'float')) {
            columnsValue.push(`${item[column.templateIndex] ? `${item[column.templateIndex]}` : null}`)
          }
        })
        // console.log('selectColumns',selectColumns.join(','),'columnsValue',columnsValue.join(','))
        connection.query(`INSERT INTO ${ctx.params.table} (${selectColumns.join(',')}) VALUES(${columnsValue.join(',')})`, (err, result) => {
          if(err) {
            ctx.response.body = {
              "success": false,
            }
            console.log(err)
            resolve()
            return
          }
        })
      })
      // console.log('done')
      // 删除文件
      fs.unlink(filePath, () => {
        connection.query(`SELECT count(*) FROM ${ctx.params.table};`, (err, result) => {
          if(err) {
            console.log(err)
            resolve()
            return
          }
          ctx.response.body = {
            "pageCount": Math.ceil(result[0]['count(*)'] / 10),
            "success": true,
          }
          resolve()
        })
      })
    })
    await next()
  }
}

module.exports.downloadItem = () => {
  return async(ctx, next) => {
    await new Promise(resolve => {
      const selectColumns = ['id']
      columns[ctx.params.table].forEach(item => {
        if(!item.editable) {
          return
        }
        selectColumns.push(item.dataIndex)
      })
      connection.query(`SELECT ${selectColumns.join(',')} FROM ${ctx.params.table}`, (err, result) => {
        if(err) {
          console.log(err)
          resolve()
          return
        }
        if(result.length !== 0) {
          // console.log('success', result)
          const data = []
          result.forEach((item, index) => {
            // console.log('item',item,typeof item)
            data[index] = []
            var keys = Object.keys(item)
            for (let i = 1; i < keys.length; i++) {
              // console.log(item[keys[i]],index)
              data[index].push(item[keys[i]])
            }
          })
          const buffer = xlsx.build([{name: "sheet1", data}])
          fs.writeFileSync(path.resolve(__dirname, '..', 'uploads', 'sheet.xlsx'), buffer)
          resolve()
        }
      })
    })
    await send(ctx, 'sheet.xlsx', {
        root: path.resolve(__dirname, '..', 'uploads')
    })
    fs.unlink(path.resolve(__dirname, '..', 'uploads', 'sheet.xlsx'))
    await next()
  }
}

module.exports.downloadTemplate = () => {
  return async(ctx, next) => {
    await send(ctx, `${ctx.params.table}.xlsx`, {
        root: path.resolve(__dirname, '..', 'tables')
    })
    await next()
  }
}

module.exports.deleteSelectedRows = () => {
  return async(ctx, next) => {
    // console.log(ctx.request.body)
    const {selectedRowKeys} = ctx.request.body
    let queryString = []
    selectedRowKeys.forEach(item => {
      queryString.push(`id = ${item}`)
    })
    // console.log('queryString',queryString,`DELETE FROM ${ctx.params.table} WHERE ${queryString.join(' OR ')};`)
    await new Promise(resolve => {
        connection.query(`DELETE FROM ${ctx.params.table} WHERE ${queryString.join(' OR ')};`, (err, result) => {
          // console.log('result',result.affectedRows)
          if(err) {
            ctx.response.body = {
              "success": false
            }
            console.log(err)
            connection.rollback()
            resolve()
            return
          }
          if(result.affectedRows > 0) {
            connection.query(`SELECT count(*) FROM ${ctx.params.table};`, (counterr, countResult) => {
              if(counterr) {
                ctx.response.body = {
                  "success": false,
                }
                console.log(counterr)
                connection.rollback()
                resolve()
                return
              }
              ctx.response.body = {
                "pageCount": Math.ceil(countResult[0]['count(*)'] / 10),
                "success": true,
              }
              resolve()
            })
          } else {
            ctx.response.body = {
              "success": false,
            }
            resolve()
          }
        })
    })
    await next()
  }
}
