// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true
})

// 云函数入口函数
exports.main = async (event, context) => {
  let db = cloud.database()
  let flc = db.collection('free_lives')
  let result = await flc.where({
    isShow: true
  }).get().then(res => {
    if (res.data.length > 0) {
      return res.data
    }else{
      return []
    }
  })
  return result
}