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
        if(result.length !== 0) {
          console.log('success')
          // 查找成功
          ctx.response.body = {
            "success": true,
            "level": result[0].level
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
    await next()
  }
}
module.exports.addAssistant = connection => {
  return async(ctx, next) => {
    const {job_id} = ctx.request.body
    console.log(job_id)
    await new Promise((resolve, reject) => {
      connection.query(`UPDATE users SET level='assistant' WHERE job_id = ${job_id}`, (err, result) => {
        if(err) reject()
        console.log(result,result.affectedRows,typeof result.affectedRows)
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
