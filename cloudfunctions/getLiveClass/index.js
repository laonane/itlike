// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true
})

// 云函数入口函数
exports.main = async (event, context) => {
  let db = cloud.database()
  let lcc = db.collection("live_classes")
  return await lcc.where({
    isShow: true
  }).get().then(res => {
    return res.data.length > 0 ? res.data : {}
  })
}