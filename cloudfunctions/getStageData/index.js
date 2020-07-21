// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true
})

// 云函数入口函数
exports.main = async (event, context) => {
  let pageNum = event.pageNum || 1
  let pageSize = event.pageSize || 2

  let db = cloud.database()
  let sc = db.collection("stage_classes")

  let result = sc.orderBy('ccNum', 'asc').skip((pageNum - 1) * pageSize).limit(pageSize).get().then(res => {
    return res
  })

  return result
}