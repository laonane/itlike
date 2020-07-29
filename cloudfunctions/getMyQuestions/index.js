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
  let count = event.count || 20

  let db = cloud.database()
  let ansewerC = db.collection('questions')
  let result = await ansewerC.where({
    _openid: openid
  }).skip((pageSize - 1) * count).limit(count).orderBy('createTime', 'desc').get().then(res=>{
    return res.data
  }).catch(err => {
    return []
  })
  
  return result
}