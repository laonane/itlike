// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true
})

// 云函数入口函数
exports.main = async (event, context) => {
  // console.log(event)
  let content = event.content
  let result = await cloud.openapi.security.msgSecCheck({
    content: content
  }).then(res => {
    return {
      success: 1
    }
  }).catch(err => {
    return {
      success: 0
    }
  })
  return result
}