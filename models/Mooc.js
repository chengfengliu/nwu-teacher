module.exports.addmoocItem = connection => {
  return async(ctx, next) => {
    // console.log(ctx.request.body)
    const {course_name, course_level, director_job_id, member = null, is_online, time, remark = null} = ctx.request.body
    await new Promise((resolve, reject) => {
      connection.query(`INSERT INTO mooc(course_name, course_level, director_job_id, member, is_online, time, remark) VALUES(
        '${course_name}', '${course_level}', '${director_job_id}', ${member ? `'${member}'`: member}, '${is_online}', '${time}', ${remark ? `'${remark}'`: remark})`, (err, result) => {
        if(err) {
          ctx.response.body = {
            "success": false
          }
          reject()
        }
        if(result.length !== 0) {
          console.log('success')
          // 增加成功
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

module.exports.removemoocItem = connection => {
  return async(ctx, next) => {
    // console.log(ctx.request.body)
    const {id} = ctx.request.body
    await new Promise((resolve, reject) => {
      connection.query(`DELETE FROM mooc WHERE id = ${id}`, (err, result) => {
        if(err) {
          ctx.response.body = {
            "success": false
          }
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

module.exports.editmoocItem = connection => {
  return async(ctx, next) => {
    // console.log(ctx.request.body)
    const {id, course_name, course_level, director_job_id, member = null, is_online, time, remark = null} = ctx.request.body
    await new Promise((resolve, reject) => {
      connection.query(`UPDATE mooc SET 
        course_name = '${course_name}',
        course_level = '${course_level}',
        director_job_id = '${director_job_id}',
        member = ${member ? `'${member}'`: member},
        is_online = '${is_online}',
        time = '${time}',
        remark = ${remark ? `'${remark}'`: remark}
        WHERE id = ${id}`, (err, result) => {
        if(err) {
          ctx.response.body = {
            "success": false
          }
          reject()
        }
        if(result.length !== 0) {
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