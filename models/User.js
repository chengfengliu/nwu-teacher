const md5 = require('md5')
module.exports.findUser = connection => {
  return async(ctx, next) => {
    const {job_id, password} = ctx.request.body
    // console.log(job_id, password,ctx.request.body)
    await new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM users WHERE job_id = ${job_id} AND password = '${md5(password)}'`, (err, result) => {
        if (err) {
          ctx.response.body = {
            "success": false
          }
          reject()
        }
        // 通过job_id查找姓名
        connection.query(`SELECT teacher_name FROM teacher_tbl WHERE job_id = ${job_id}`, (err2, teacher_name) => {
          if (err2) {
            ctx.response.body = {
              "success": false
            }
            reject()
          }
          if(result.length !== 0) {
            // console.log('success',teacher_name)
            // 查找成功
            if(result[0].level === 'admin') {
              ctx.response.body = {
                "success": true,
                "level": result[0].level,
                "userName": 'admin'
              } 
            } else {
              ctx.response.body = {
                "success": true,
                "level": result[0].level,
                "userName": teacher_name[0].teacher_name,
                "job_id": job_id,
              }
            }
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
    })
    await next()
  }
}
module.exports.addAssistant = connection => {
  return async(ctx, next) => {
    const {job_id} = ctx.request.body
    // console.log(job_id)
    await new Promise((resolve, reject) => {
      connection.query(`UPDATE users SET level='assistant' WHERE job_id = ${job_id}`, (err, result) => {
        if(err) reject()
        // console.log(result,result.affectedRows,typeof result.affectedRows)
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
    await next()
  }
}

module.exports.modifyPassword = connection => {
  return async(ctx, next) => {
    const {newPassword, job_id} = ctx.request.body
    // console.log('modifyPassword', newPassword, job_id,`UPDATE users SET password = '${md5(newPassword)}' WHERE job_id = ${job_id};`)
    await new Promise((resolve, reject) => {
      connection.query(`UPDATE users SET password = '${md5(newPassword)}' WHERE job_id = ${job_id};`, (err, result) => {
        if(err) {
          throw err
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
    await next()
  }
}