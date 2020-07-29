// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true
})

// 云函数入口函数
exports.main = async (event, context) => {
  let comment = event.comment
  let qID = event.qID
  let userInfo = event.userInfo

  let db = cloud.database()
  let aC = db.collection('answers')

  let result = await aC.add({
    data:{
      comment,
      qID,
      userInfo,
      createTime: db.serverDate()
    }
  })
  return result
}