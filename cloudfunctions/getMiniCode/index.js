// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true
})


// 云函数入口函数
exports.main = async (event, context) => {
  try {
    let result = await cloud.openapi.wxacode.getUnlimited({
      scene: 'byQRCode',
      autoColor: true
    }).then(async res => {
      // console.log(res)
      return await cloud.uploadFile({
        cloudPath: 'itlike/miniCode/miniCode.jpg',
        fileContent: res.buffer
      }).then(v => {
        return v.fileID
      }).catch(err => {
        console.log(err)
      })
    }).catch(err => {
      console.error(err)
    })
    return result
  } catch (err) {
    return err
  }
}