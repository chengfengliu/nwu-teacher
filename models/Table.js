const xlsx = require('node-xlsx')
const send = require('koa-send')

const path = require('path')
const fs = require('fs')
const XLSX = require('xlsx')
// 连接MySQL数据库
const mysql = require('mysql')
const mysqlConfig = require('../mysqlConfig')
const connection = mysql.createConnection(mysqlConfig)

const TeacherTbl = require('./TeacherTbl.js')
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
const CourseWorkloadTbl = require('./CourseWorkloadTbl.js')
const CourseTbl = require('./CourseTbl.js')
const CorporateMentorTbl = require('./CorporateMentorTbl.js')
const ExtraJobWorkloadTbl = require('./ExtraJobWorkloadTbl.js')
const GradprojectTbl = require('./GradprojectTbl.js')
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
    {
        name: 'course_tbl',
        idColumnName: 'course_id',
    },
]

const columns = {
  'teacher_tbl': TeacherTbl.columns,
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
  'course_workload_tbl': CourseWorkloadTbl.columns,
  'course_tbl': CourseTbl.columns,
  'corporate_mentor_tbl': CorporateMentorTbl.columns,
  'extra_job_workload_tbl': ExtraJobWorkloadTbl.columns,
  'gradproject_tbl': GradprojectTbl.columns,
  'internship_tbl': InternshipTbl.columns,
  'internship_workload_tbl': InternshipWorkloadTbl.columns,
}
const rulesList = {
  'mooc': Mooc.rules,
  'instruct_student_innovate': InstructStudentInnovate.rules,
  'teach_reformation': TeachReformation.rules,
  'teach_model_center': TeachModelCenter.rules,
  'teach_team': TeachTeam.rules,
  'major': Major.rules,
  'textbook': Textbook.rules,
  'course_workload_tbl': CourseWorkloadTbl.rules,
  'instruct_student_match': InstructStudentMatch.rules,
  'top_teacher': TopTeacher.rules,
  'teach_award': TeachAward.rules,
  'excellent_course': ExcellentCourse.rules,
  'extra_job_workload_tbl': ExtraJobWorkloadTbl.rules,
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
      const selectColumns = [`${ctx.params.table}.id`]
      publicTable.forEach(item => {
        if(ctx.params.table === item.name) {
          // 如果是公共表，其id列要改名为id，如teacher_tbl的job_id改为id，因为前端需要接收id作为每一个记录行key
          selectColumns[0] = `${item.idColumnName} as id`
        }
      })
      let sourceTable = '', whereString = ''
      columns[ctx.params.table].forEach(item => {
        if(!item.editable) {
          if(sourceTable.indexOf(item.sourceTable) == -1) {
            // 避免重复添加同一外表
            sourceTable = sourceTable.concat(`,${item.sourceTable}`)
          }
          if(whereString === '') {
            whereString = whereString.concat(`${ctx.params.table}.${item.primaryKey}=${item.sourceTable}.${item.foreignKey}`)
          } else {
            whereString = whereString.concat(` AND ${ctx.params.table}.${item.primaryKey}=${item.sourceTable}.${item.foreignKey}`)
          }
          selectColumns.push(`${item.sourceTable}.${item.dataIndex}`)
        } else {
          selectColumns.push(`${ctx.params.table}.${item.dataIndex}`)
        }
      })
      // console.log('selectColumns',selectColumns,'sourceTable',sourceTable,'whereString',whereString)
      connection.query(`SELECT ${selectColumns.join(',')} FROM ${ctx.params.table}${sourceTable === '' ? '' : `${sourceTable} WHERE ${whereString}`} LIMIT ${(page - 1) * 10}, 10;`, (err, result) => {
        if(err) {
          console.log(err)
          resolve()
          return
        }
        // console.log('getItem result', result)
        ctx.response.body = {
          "data": result
        }
        resolve()
      })
    })
    await next()
  }
}

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
          // console.log('item',item[0], typeof item[0],item[1], typeof item[1],item[2],typeof item[2],item[3], typeof item[3],item[4], typeof item[4],item[5], typeof item[5],item[6], typeof item[6],item[7], typeof item[7],item[8], typeof item[8],item[9], typeof item[9],item[10], typeof item[10],notNullIndexs.every(index => item[index]))
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
        // console.log('item',item)
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

module.exports.computeAndDownload = () => {
  return async(ctx, next) => {
    const {rules} = ctx.request.body
    const ruleColumnName = rulesList[ctx.params.table].ruleColumnName
    console.log('computeAndDownload',rules,ruleColumnName)
    await new Promise(resolve => {
      const rulesObject = {}
      // 匹配汉字的正则表达式
      const ChineseCharacters = /[\u4e00-\u9fa5]+/g;
      const ChineseCharactersObject = {}
      rules.forEach(item => {
        const rulesObjectItem = []
        // 由规则里出现的中文列名组成的数组，没有中文就是null
        const workloadResult = item.workload.match(ChineseCharacters)
        const performanceScoreResult = item.performance_score.match(ChineseCharacters)
        const bonusResult = item.bonus.match(ChineseCharacters)

        if(workloadResult) {
          // 工作量含有变量（中文）
          workloadResult.forEach((item2, index) => {
            // console.log(item.workload,workloadResult[index],rulesList[ctx.params.table].Chinese2English[item2])
            // 把中文换成英文
            item.workload = item.workload.replace(workloadResult[index], rulesList[ctx.params.table].Chinese2English[item2])
            workloadResult[index] = rulesList[ctx.params.table].Chinese2English[item2]
          })
        }
        // 全部换为英文后
        rulesObjectItem.push(item.workload)

        if(performanceScoreResult) {
          performanceScoreResult.forEach((item2, index) => {
            item.performance_score = item.performance_score.replace(performanceScoreResult[index], rulesList[ctx.params.table].Chinese2English[item2])
            performanceScoreResult[index] = rulesList[ctx.params.table].Chinese2English[item2]
          })
        }
        rulesObjectItem.push(item.performance_score)

        if(bonusResult) {
          bonusResult.forEach((item2, index) => {
            item.bonus = item.bonus.replace(bonusResult[index], rulesList[ctx.params.table].Chinese2English[item2])
            bonusResult[index] = rulesList[ctx.params.table].Chinese2English[item2]
          })
        } 
        rulesObjectItem.push(item.bonus)
        
        rulesObject[item[ruleColumnName]] = rulesObjectItem
        ChineseCharactersObject[item[ruleColumnName]] = [workloadResult, performanceScoreResult, bonusResult]
      })
      console.log('\nrulesObject\n',rulesObject,'\nChineseCharactersObject\n',ChineseCharactersObject)
    //   rulesObject
    //   { '课堂理论课':
    //     [ 
    //       '(credit*20)*[1+(student_num/50-1)*0.3]*benefit_coefficient',
    //       '',
    //       '' 
    //     ] 
    //   }
    //  ChineseCharactersObject
    //   { '课堂理论课':
    //     [ 
    //       [ 'credit', 'student_num', 'benefit_coefficient' ],
    //       null,
    //       null 
    //     ] 
    //   }
      const selectColumns = [`${ctx.params.table}.id`]
      const data = []
      let tableHead = []

      let sourceTable = '', whereString = ''
      columns[ctx.params.table].forEach(item => {
        if(!item.editable) {
          if(sourceTable.indexOf(item.sourceTable) == -1) {
            // 避免重复添加同一外表
            sourceTable = sourceTable.concat(`,${item.sourceTable}`)
          }
          if(whereString === '') {
            whereString = whereString.concat(`${ctx.params.table}.${item.primaryKey}=${item.sourceTable}.${item.foreignKey}`)
          } else {
            whereString = whereString.concat(` AND ${ctx.params.table}.${item.primaryKey}=${item.sourceTable}.${item.foreignKey}`)
          }
          selectColumns.push(`${item.sourceTable}.${item.dataIndex}`)
        } else {
          selectColumns.push(`${ctx.params.table}.${item.dataIndex}`)
        }
        tableHead.push(item.title) // 表头
      })
      tableHead = tableHead.concat(['工作量', '绩效', '奖金'])
      console.log('tableHead',tableHead,'selectColumns',selectColumns)
      // console.log('selectColumns',selectColumns,'sourceTable',sourceTable,'whereString',whereString)
      
      connection.query(`SELECT ${selectColumns.join(',')} FROM ${ctx.params.table}${sourceTable === '' ? '' : `${sourceTable} WHERE ${whereString}`};`, (err, result) => {
        if(err) {
          console.log(err)
          resolve()
          return
        }
        if(result.length !== 0) {
          // console.log('success', result)
          result.forEach(async(item, index) => {
            // console.log('item',item,index)
            data[index] = []
            const keys = Object.keys(item)
            // 深拷贝，不能用Object.assign
            const newRulesObject = JSON.parse(JSON.stringify(rulesObject))
            // console.log('newRulesObject',newRulesObject,'rulesObject',rulesObject)
            for (let i = 0; i < keys.length; i++) {
              // console.log(keys[i],ChineseCharactersObject,item[ruleColumnName])
              // console.log(keys[i],ChineseCharactersObject[item[ruleColumnName]].workload,ChineseCharactersObject[item[ruleColumnName]].workload.indexOf(keys[i]))
              if(keys[i] === 'id') {
                continue
              }
              if(ChineseCharactersObject[item[ruleColumnName]]) {
                if(ChineseCharactersObject[item[ruleColumnName]][0] && ChineseCharactersObject[item[ruleColumnName]][0].indexOf(keys[i]) !== -1) {
                  // console.log('keys[i]',keys[i],item[keys[i]])
                  // 0-workload
                  // console.log('before:',newRulesObject[item[ruleColumnName]])
                  // 英文列名替换为数字
                  newRulesObject[item[ruleColumnName]][0] = newRulesObject[item[ruleColumnName]][0].replace(keys[i], item[keys[i]])
                  // console.log('after:',newRulesObject[item[ruleColumnName]])
                }
                if(ChineseCharactersObject[item[ruleColumnName]][1] && ChineseCharactersObject[item[ruleColumnName]][1].indexOf(keys[i]) !== -1) {
                  // 1-performance_score
                  newRulesObject[item[ruleColumnName]][1] = newRulesObject[item[ruleColumnName]][1].replace(keys[i], item[keys[i]])
                }
                if(ChineseCharactersObject[item[ruleColumnName]][2] && ChineseCharactersObject[item[ruleColumnName]][2].indexOf(keys[i]) !== -1) {
                  // 2-bonus
                  newRulesObject[item[ruleColumnName]][2] = newRulesObject[item[ruleColumnName]][2].replace(keys[i], item[keys[i]])
                }
              }   
              // 自身数据
              data[index].push(item[keys[i]])
            }
            if(newRulesObject[item[ruleColumnName]]) {
              newRulesObject[item[ruleColumnName]][0] = eval(newRulesObject[item[ruleColumnName]][0]) ? eval(newRulesObject[item[ruleColumnName]][0]) : 0
              newRulesObject[item[ruleColumnName]][1] = eval(newRulesObject[item[ruleColumnName]][1]) ? eval(newRulesObject[item[ruleColumnName]][1]) : 0
              newRulesObject[item[ruleColumnName]][2] = eval(newRulesObject[item[ruleColumnName]][2]) ? eval(newRulesObject[item[ruleColumnName]][2]) : 0
            }
            
            // 连接计算出的工作量、绩效、奖金
            data[index] = data[index].concat(newRulesObject[item[ruleColumnName]])
            await new Promise(resolve => {
              // 修改数据库数据中的工作量、绩效、奖金
              connection.query(`UPDATE ${ctx.params.table} SET workload=${newRulesObject[item[ruleColumnName]][0]},performance_score=${newRulesObject[item[ruleColumnName]][1]},bonus=${newRulesObject[item[ruleColumnName]][2]} WHERE ${ctx.params.table}.id=${item['id']};`, (err, result) => {
                if(err) {
                  console.log(err)
                  resolve()
                  return
                }
                resolve()
              })
            })
            
          })
          // 插入表头
          data.unshift(tableHead)
          // console.log('data',data)
          const buffer = xlsx.build([{name: "sheet1", data}])
          // 将二进制转化为数组，传到前端
          const wbout = XLSX.read(buffer,{type:'buffer'})
          ctx.response.body = wbout
          resolve()
        }
      })
    })
    await next()
  }
}

module.exports.getRules = () => {
  return async(ctx, next) => {
    ctx.response.body = rulesList[ctx.params.table].columns
    await next()
  }
}

module.exports.generate = () => {
  return async(ctx, next) => {
    console.log(ctx.request.body)
    const {job_id} = ctx.request.body
    // data存放表格数据
    const data = []
    let index = 1
    let workloadTotal = 0, performanceScoreTotal = 0, bonusTotal = 0
    const tableHead = ['类别', '名称', '级别', '工作量', '绩效', '奖金']
    data[0] = tableHead
    for(const tableName in rulesList) {
      console.log('tableName ',tableName)
      // 遍历每个表
      const tableType = rulesList[tableName].tableType
      const selectColumns = []
      let sourceTable = '', whereString = ''
      if(rulesList[tableName].editable === false) {
        // 需要外表
        sourceTable = sourceTable.concat(`,${rulesList[tableName].sourceTable}`)
        whereString = whereString.concat(`${tableName}.${rulesList[tableName].primaryKey}=${rulesList[tableName].sourceTable}.${rulesList[tableName].foreignKey}`)
        selectColumns.push(`${rulesList[tableName].sourceTable}.${rulesList[tableName].itemColumnName}`)
        selectColumns.push(`${rulesList[tableName].sourceTable}.${rulesList[tableName].ruleColumnName}`)
      } else {
        if(rulesList[tableName].itemColumnName === '') {
          selectColumns.push(`''`)
        } else {
          selectColumns.push(`${tableName}.${rulesList[tableName].itemColumnName}`)
        }
        selectColumns.push(`${tableName}.${rulesList[tableName].ruleColumnName}`)
      }
      
      selectColumns.push(`${tableName}.workload`)
      selectColumns.push(`${tableName}.performance_score`)
      selectColumns.push(`${tableName}.bonus`)
      if(whereString === '') {
        whereString = whereString.concat(`${tableName}.job_id=${job_id}`)
      } else {
        whereString = whereString.concat(` AND ${tableName}.job_id=${job_id}`)
      }
      console.log('whereString',whereString,'selectColumns',selectColumns)
      await new Promise(resolve => {
        connection.query(`SELECT ${selectColumns.join(',')} FROM ${tableName}${sourceTable === '' ? '' : sourceTable} WHERE ${whereString};`, (err, result) => {
          if(err) {
            console.log(err)
            resolve()
            return
          }
          if(result.length !== 0) {
            // console.log('success', result)
            result.forEach(item => {
              // console.log('item',item,index)
              data[index] = [tableType]
              var keys = Object.keys(item)
              for (let i = 0; i < keys.length; i++) {
                // 自身数据
                data[index].push(item[keys[i]])
              }
              workloadTotal += item.workload
              performanceScoreTotal += item.performance_score
              bonusTotal += item.bonus
              index++
            })
          }
          resolve()
        })
        console.log('after search')
      })
    }
    // console.log('data',data)
    data[index] = ['汇总', '', '', workloadTotal, performanceScoreTotal, bonusTotal]
    const buffer = xlsx.build([{name: "sheet1", data}])
    // 将二进制转化为数组，传到前端
    const wbout = XLSX.read(buffer,{type:'buffer'})
    ctx.response.body = wbout
    await next()
  }
}
