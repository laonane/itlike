# 云开发

本项目使用了云开发，云开发的三大基础能力：

- 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 文档型数据库
- 文件存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码

# 首页功能
## 全栈直播班

- 点击课程图片可转跳到相应的课程界面(腾讯课堂小程序)
- 课程介绍数据从云数据库中读取

## 最新公开课

- 课程列表采用轮播图的方式呈现
- 热门评论是直接爬取 [课程用户评论](https://m.ke.qq.com/cgi-bin/comment_new/course_comment_list)
- 采用云开发提供的数据库进行开发

## 学习路线

- 使用自定义组件 [卡片式组件:stage-card](https://github.com/HuaiAnGG/itlike/blob/master/miniprogram/components/stageCard/stageCard.wxml)、[加载更多组件：load-more](https://github.com/HuaiAnGG/itlike/blob/master/miniprogram/components/loadMore/loadMore.wxml)
- 对数据进行分页请求
- 分页请求的数据进行追加

## 关于撩课

- 使用video组件

## 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

