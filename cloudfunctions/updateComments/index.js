// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true
})

let db = cloud.database()
let freeLiveC = db.collection('free_lives')

/**
 *  参照id，爬取课程在腾讯课堂上面的评论信息
 * @param {item} item 
 */
function getData(item) {
  let cid = item.liveID
  let url = `https://m.ke.qq.com/cgi-bin/comment_new/course_comment_list`
  let options = {
    url: url,
    qs: {
      count: 20,
      cid: cid,
      filter_rating: 1,
      page: 0
    },
    headers: {
      "referer": `https://m.ke.qq.com/comment.html?course_id=${cid}`,
    },
    json: true
  }
  rp(options).then(res => {
    let result = res.result.items.map(item => {
      if (!item.pic_url.startsWith('http')) {
        item.pic_url = "http:" + item.pic_url.replace(/&amp;/g, '&')

      }
      return {
        first_comment: item.first_comment,
        pic_url: item.pic_url
      }
    })

    // 写入到数据库里面
    console.log(result)
    freeLiveC.doc(item._id).update({
      data: {
        comments: result
      }
    }).then(res => {
      console.log("更新数据成功", res)
    })
  })
}

// 云函数入口函数
exports.main = async (event, context) => {
  // 1. 获取所有显示课程的id

  freeLiveC.field({
    liveID: true
  }).where({
    isShow: true
  }).get().then(res => {
    // console.log(res)
    res.data.forEach(item => {
      // console.log(item)
      getData(item)
    })
  })
  // 2. 参照id，爬取课程在腾讯课堂上面的评论信息
  // 3. 写入数据库中
}