// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true
})

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  let start = event.start || 1
  let count = event.count || 5
  let qID = event.questionID 

  let db = cloud.database()
  let qC = db.collection('answers')

  // console.log(qID)

  let result = await qC.where({
    qID: qID
  }).skip((start - 1) * count).limit(count).orderBy("createTime", "desc").get().then(res => {
    // console.log(res)
    return res.data
  }).catch(err => {
    console.error(err)
  })

  return result
}