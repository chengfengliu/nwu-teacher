const xlsx = require('node-xlsx')
const send = require('koa-send')

const path = require('path')
const fs = require('fs')
module.exports.getmoocItem = connection => {
  return async(ctx, next) => {
    // console.log('getmoocItem',ctx.request.body)
    const {page} = ctx.request.body
    await new Promise((resolve, reject) => {
      connection.query(`SELECT id, course_name, course_level, director_job_id, member, is_online, time, remark, performance_scroe,bonus, workload FROM mooc LIMIT ${(page - 1) * 10}, 10`, (err, result) => {
        if(err) {
          reject()
        }
        if(result.length !== 0) {
          // console.log('success', result)
          ctx.response.body = {
            "data": result
          }
          resolve()
        }
      })
    })
    await next()
  }
}

module.exports.addmoocItem = connection => {
  return async(ctx, next) => {
    console.log('addmoocItem',ctx.request.body)
    const {course_name, course_level, director_job_id, member = null, is_online, time, remark = null, performance_scroe = null, bonus = null, workload = null} = ctx.request.body
    await new Promise((resolve, reject) => {
      connection.query(`INSERT INTO mooc(course_name, course_level, director_job_id, member, is_online, time, remark, performance_scroe, bonus, workload) VALUES(
          '${course_name}',
          '${course_level}',
          '${director_job_id}',
          ${member ? `'${member}'`: null},
          '${is_online}', 
          '${time}',
          ${remark ? `'${remark}'`: null},
          ${performance_scroe ? `'${performance_scroe}'`: null},
          ${bonus ? `'${bonus}'`: null},
          ${workload ? `'${workload}'`: null})
        `, (err, result) => {
        if(err) {
          console.log(err)
          ctx.response.body = {
            "success": false,
          }
          reject()
        }
        console.log('result',result)
        if(result.affectedRows === 1) {
          console.log('success')
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

module.exports.removemoocItem = connection => {
  return async(ctx, next) => {
    console.log(ctx.request.body)
    const {id} = ctx.request.body
    await new Promise((resolve, reject) => {
      // 事务
      connection.beginTransaction(transactionErr => {
        if (transactionErr) {
          console.log(transactionErr)
        }
        connection.query(`DELETE FROM mooc WHERE id = ${parseInt(id)};`, (err, result) => {
          console.log('result',result.affectedRows)
          // id要转换
          if(err) {
            ctx.response.body = {
              "success": false
            }
            console.log(err)
            connection.rollback()
            reject()
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
module.exports.rollbackmoocItem = connection => {
  console.log('rollback')
  return async(ctx, next) => {
    console.log('rollback')
    await new Promise((resolve, reject) => {
      connection.rollback(err => {
        if(err) {
          console.log(err)
          ctx.response.body = {
            "success": false
          }
          reject()
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
module.exports.commitmoocItem = connection => {
  return async(ctx, next) => {
    console.log('commit')
    await new Promise((resolve, reject) => {
      connection.commit(err => {
        if(err) {
          console.log(err)
          ctx.response.body = {
            "success": false
          }
          reject()
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
module.exports.editmoocItem = connection => {
  return async(ctx, next) => {
    // console.log(ctx.request.body)
    const {id, course_name, course_level, director_job_id, member = null, is_online, time, remark = null, performance_scroe = null, bonus = null, workload = null} = ctx.request.body
    // console.log('member',member ? `'${member}'`: member,parseInt(id),'performance_scroe',performance_scroe)
    await new Promise((resolve, reject) => {
      // String转换成Number和变量不是NULL加引号
      connection.query(`UPDATE mooc SET 
        course_name = '${course_name}',
        course_level = '${course_level}',
        director_job_id = '${parseInt(director_job_id)}', 
        member = ${member ? `'${member}'`: null}, 
        is_online = '${is_online}',
        time = '${time}',
        remark = ${remark ? `'${remark}'`: null},
        performance_scroe = ${performance_scroe ? parseFloat(performance_scroe): null},
        bonus = ${bonus ? parseFloat(bonus): null},
        workload = ${workload ? parseFloat(workload): null}
        WHERE id = ${parseInt(id)};`, (err, result) => {
        if(err) {
          console.log(err)
          ctx.response.body = {
            "success": false
          }
          reject()
        }
        // console.log('result',result) 
        if(result && result.length !== 0) {
          console.log('success')
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

module.exports.searchmoocItem = connection => {
  return async(ctx, next) => {
    const {director_job_id} = ctx.request.body
    await new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM mooc WHERE director_job_id = ${director_job_id}`, (err, result) => {
        console.log(result)
        if (err) {
          console.log(err)
          ctx.response.body = {
            "success": false
          }
          reject()
        }
        if(result.length !== 0) {
          // 查找成功
          ctx.response.body = result
          resolve()
        } else {
          // 查找失败
          ctx.response.body = {
            "success": false
          }
          resolve()
        }
      })
    })
    await next()
  }
}

module.exports.uploadmoocItem = connection => {
  return async(ctx, next) => {
    const file = ctx.req.file
    let requiredFieldNull = false
    await new Promise((resolve, reject) => {
      // console.log('file', file, path.resolve(__dirname, '..', 'uploads', file.filename))
      const filePath = path.resolve(__dirname, '..', 'uploads', file.filename)
      const workSheets = xlsx.parse(filePath)
      // 删除表头
      workSheets[0].data.shift()
      // console.log('workSheets', workSheets,'data\n',workSheets[0].data)
      workSheets[0].data.forEach(item => {
        const course_name = item[0] ? item[0] : null
        const course_level = item[1] ? item[1] : null
        const director_name = item[2] ? item[2] : null
        const director_job_id = item[3] ? item[3] : null
        const member = item[4] ? item[4] : null
        const is_online = item[5] ? item[5] : null
        const time = item[6] ? item[6] : null
        const remark = item[7] ? item[7] : null
        const performance_scroe = item[8] ? item[8] : null
        const bonus = item[9] ? item[9] : null
        const workload = item[10] ? item[10] : null
        if(!(course_name && course_level && director_job_id && is_online && time)) {
          console.log('not null')
          requiredFieldNull = true
          return
        }
        console.log('item', course_name,typeof course_name, course_level, director_name, director_job_id,typeof director_job_id, member, is_online, time, remark, performance_scroe, bonus, workload, typeof workload)
        connection.query(`INSERT INTO mooc(course_name, course_level, director_job_id, member, is_online, time, remark, performance_scroe, bonus, workload) VALUES(
          '${course_name}',
          '${course_level}',
          '${director_job_id}',
          ${member ? `'${member}'`: null},
          '${is_online}', 
          '${time}',
          ${remark ? `'${remark}'`: null},
          ${performance_scroe ? `'${performance_scroe}'`: null},
          ${bonus ? `'${bonus}'`: null},
          ${workload ? `'${workload}'`: null})
        `, (err, result) => {
          if(err) {
            console.log(err)
          }
        })
      })
      // console.log('done')
      // 删除文件
      fs.unlink(filePath, () => {
        if(requiredFieldNull) {
          ctx.response.body = {
            "success": false,
            "requiredFieldNull": true,
          }
        } else {
          ctx.response.body = {
            "success": true,
          }
        }
        resolve()
      })

    })
    await next()
  }
}

module.exports.downloadmoocItem = connection => {
  return async(ctx, next) => {
    await new Promise((resolve, reject) => {
      connection.query(`SELECT id, course_name, course_level, director_job_id, member, is_online, time, remark, performance_scroe,bonus, workload FROM mooc`, (err, result) => {
        if(err) {
          reject()
        }
        if(result.length !== 0) {
          console.log('success', result)
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
          const buffer = xlsx.build([{name: "mySheetName", data}])
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