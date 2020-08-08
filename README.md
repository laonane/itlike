# 体验码

- 已经完成整个项目，并开源，可以扫码体验

- 小程序体验码

![体验码](https://bucketblog.oss-cn-shenzhen.aliyuncs.com/blog/pic2020/08/itlike-qrcode.jpg)


#### Tips

- **如果没有及时授权体验，可以先扫体验二维码提交申请，然后再加作者的微信，备注：itlike体验 or itlike小程序体验，**
- **如果没有及时授权体验，可以先扫体验二维码提交申请，然后再加作者的微信，备注：itlike体验 or itlike小程序体验，**
- **如果没有及时授权体验，可以先扫体验二维码提交申请，然后再加作者的微信，备注：itlike体验 or itlike小程序体验，**

![作者微信](https://bucketblog.oss-cn-shenzhen.aliyuncs.com/blog/pic2020/08/laona_wechat_qr_code.jpg)



# 云开发

本项目使用了云开发，云开发的三大基础能力：

- 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 文档型数据库
- 文件存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码

# 撩课小程序

- [github地址：https://github.com/HuaiAnGG/itlike](https://github.com/HuaiAnGG/itlike)
- 先上效果

<video src="https://bucketblog.oss-cn-shenzhen.aliyuncs.com/blog/pic2020/07/%E5%B0%8F%E7%A8%8B%E5%BA%8F.mp4" controls="controls" width="500" height="300">您的浏览器不支持播放该视频！ </video>


# 首页模块

![效果图](https://bucketblog.oss-cn-shenzhen.aliyuncs.com/blog/pic2020/07/home.jpg)

## 全栈直播班

- 点击课程图片可转跳到相应的课程界面(腾讯课堂小程序)
- 课程介绍数据从云数据库中读取

## 最新公开课

- 课程列表采用轮播图的方式呈现
- 热门评论是直接爬取 [课程用户评论API:https://m.ke.qq.com/cgi-bin/comment_new/course_comment_list](#)
- 采用云开发提供的数据库进行开发

## 学习路线

- 使用自定义组件 [卡片式组件:stage-card](https://github.com/HuaiAnGG/itlike/blob/master/miniprogram/components/stageCard/stageCard.wxml)、[加载更多组件：load-more](https://github.com/HuaiAnGG/itlike/blob/master/miniprogram/components/loadMore/loadMore.wxml)

- 对数据进行分页请求(云函数)

```js
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
```

- 分页请求的数据进行追加
```js
// 请求的数据，如果有数据，则进行追加
if (res.result.data.length > 0) {
    currentPage++
}
this.setData({
    isLoading: false,
    stageData: this.data.stageData.concat(res.result.data)
})
```

## 关于撩课

- 使用video组件，视频文件：[视频资源](http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400)
- vedio 使用文档，请移步：[官方文档](https://developers.weixin.qq.com/miniprogram/dev/component/video.html)


## 客服

![客服](https://bucketblog.oss-cn-shenzhen.aliyuncs.com/blog/pic2020/07/contact.jpg)

- 使用小程序的开发功能 `<button open-type="contact"/>`,同时需要在微信公众平台绑定客服人员的微信号


# 讨论区模块

![谈论区](https://bucketblog.oss-cn-shenzhen.aliyuncs.com/blog/pic2020/07/discussion2.jpg)

## 发布

![发布](https://bucketblog.oss-cn-shenzhen.aliyuncs.com/blog/pic2020/07/publish.jpg)

## 评论

![评论](https://bucketblog.oss-cn-shenzhen.aliyuncs.com/blog/pic2020/07/comment.jpg)

# 我的模块

![我的](https://bucketblog.oss-cn-shenzhen.aliyuncs.com/blog/pic2020/07/mine.jpg)

- 我的提问

![我的回答](https://bucketblog.oss-cn-shenzhen.aliyuncs.com/blog/pic2020/07/question.jpg)

- 我的回答

![回答](https://bucketblog.oss-cn-shenzhen.aliyuncs.com/blog/pic2020/07/answer.jpg)

## 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

