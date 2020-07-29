// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true
})

// 云函数入口函数
exports.main = async (event, context) => {
  // console.log(event)
  let start = event.start || 1
  let count = event.count || 5
  let key = event.key || ''
  let db = cloud.database()
  let qC = db.collection('questions')
  let whereObject = {}
  if (key.trim().length > 0) {
    whereObject = {
      "question.content": db.RegExp({
        "regexp": key,
        "options": "i"
      })
    }
  }
  // console.log("whereObject", whereObject)
  let result = await qC.where(whereObject).skip((start - 1) * count).limit(count).orderBy("createTime", "desc").get().then(res => {
    // console.log(res)
    return res.data
  }).catch(err => {
    console.error(err)
  })
  return result
}