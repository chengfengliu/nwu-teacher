module.exports.getPageCount = connection => {
  return async(ctx, next) => {
    // console.log(ctx.request.body)
    const {table} = ctx.request.body
    await new Promise((resolve, reject) => {
      connection.query(`SELECT count(*) FROM ${table}`, (err, result) => {
        if(err) {
          reject()
        }
        if(result.length !== 0) {
          // console.log('success', result)
          ctx.response.body = {
            "pageCount": Math.ceil(result[0]['count(*)'] / 10)
          }
          resolve()
        }
      })
    })
    await next()
  }
}