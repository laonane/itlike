// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true
})

// 云函数入口函数
exports.main = async (event, context) => {
  let fileIDs = event.fileIDs

  let promiseList = []
  for (let index = 0; index < fileIDs.length; index++) {
    let promise = new Promise(async (resolve, reject) => {
      let fileID = fileIDs[index]
      let res = await cloud.downloadFile({
        fileID: fileID,
      })
      let buffer = res.fileContent

      // 获取图片扩展名
      let fileIDSplit = fileID.split('.')
      // let extName = fileIDSplit[fileIDSplit.length - 1]
      let mimeType = 'image/' + fileIDSplit[fileIDSplit.length - 1]
      mimeType = mimeType.replace('jpg', 'jpeg')
      let result = await cloud.openapi.security.imgSecCheck({
        media: {
          contentType: mimeType,
          value: buffer
        }
      }).then(res => {
        resolve(true)
      }).catch(err => {
        reject(false)
      })
    })
    promiseList.push(promise)
  }

  return Promise.all(promiseList).then(res => {
    console.log('验证成功', res)
    return {
      success: 1
    }
  }).catch(async err => {
    console.error('验证失败', err)
    let deleteResult = await cloud.deleteFile({
      fileList: fileIDs
    })
    return {
      success: 0
    }
  })

  // if (!result) {
  //   let deleteResult = await cloud.deleteFile({
  //     fileList: fileIDs
  //   }).then(res => {
  //     // handle success
  //     console.log('违规图片删除成功', res.fileList)
  //   }).catch(error => {
  //     // handle error
  //     console.error('违规图片删除错误', error)
  //   })
  //   return {
  //     success: 0
  //   }
  // }
  // return {
  //   success: 1
  // }
}