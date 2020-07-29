// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let openid = wxContext.OPENID

  let pageSize = event.pageSize || 1
  let count = event.count || 10

  let db = cloud.database()
  let ansewerC = db.collection('answers')
  let qIDs = await ansewerC.where({
    _openid: openid
  }).field({
    qID: true,
    _id: false
  }).get().then(res => {
    let list = res.data.map(v => v.qID)
    list = [...new Set(list)]
    return list
  }).catch(err => {
    return []
  })

  console.log(qIDs)

  let questionC = db.collection('questions')
  let result = await questionC.where({
    _id: db.command.in(qIDs)
  }).skip((pageSize - 1) * count).limit(count).orderBy('createTime', 'desc').get().then(res => {
    return res.data
  }).catch(err => {
    return []
  })

  return result
}