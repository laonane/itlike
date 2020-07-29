// questionBar/questionBar.js
let g_userInfo = {}

let db = wx.cloud.database()
let aC = db.collection('answers')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    questionID: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    isModal: false,
    isAnswer: false,
    commentCount: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 文本检测函数，成功返回1，失败返回0
     * @param {text} _content 待检测文本
     * @param {function} callback 回调函数
     */
    _checkMsgContent(_content, callback) {
      wx.showLoading({
        title: '文本检测中...',
      })
      // 内容安全监测
      wx.cloud.callFunction({
        name: 'contentCheck',
        data: {
          content: _content
        },
        success: res => {
          // console.log(res)
          wx.hideLoading()
          let success = res.result.success
          if (success) {
            callback()
          } else {
            wx.showToast({
              mask: true,
              title: '文字违法违规',
              image: '/images/error.png'
            })
          }
        },
        fail: err => {
          wx.hideLoading()
          // console.error(res)
        }
      })
    },
    _handlerUserInfo(userInfo) {
      // console.log('授权成功的业务逻辑', userInfo)
      g_userInfo = userInfo
      this.setData({
        isAnswer: true
      })
    },
    /**
     * 回答内容处理：
     *  违规检查
     *  内容发布
     */
    _handlerPublishAnswer(evt) {
      let content = evt.detail.content
      // console.log('开始发布流程', content)
      this._checkMsgContent(content, () => {
        wx.showLoading({
          title: '发布中',
        })
        wx.cloud.callFunction({
          name: 'answers',
          data: {
            comment: content,
            qID: this.data.questionID,
            userInfo: g_userInfo
          }
        }).then(res => {
          wx.hideLoading()
          this.setData({
            isAnswer: false,
            commentCount: this.data.commentCount + 1
          })
          wx.showToast({
            title: '评论成功',
          })
        }).catch(err => {
          wx.hideLoading()
          console.error('评论无法存储到数据库', err)
        })
      })
    },
    /**
     * 回答按钮的事件处理
     */
    _handlerAnswer() {
      wx.getSetting({
        withSubscriptions: true,
        success: res => {
          // console.log(res)
          let result = res.authSetting['scope.userInfo']
          if (result) {
            wx.getUserInfo({
              success: res => {
                this._handlerUserInfo(res.userInfo)
              }
            })
          } else {
            this.setData({
              isModal: true
            })
          }
        }
      })
    },
    _handlerAuthorSuccess(evt) {
      this.setData({
        isModal: false
      })
      this._handlerUserInfo(evt.detail.userInfo)
    },
  },
  lifetimes: {
    pageLifetimes: {
      show: async function () {
        // 页面被展示
        await aC.where({
          qID: this.data.questionID
        }).count().then(res => {
          this.setData({
            commentCount: res.total
          })
        }).catch(err => {
          console.log('请求数据库失败', err)
        })
      }
    },
    attached: async function () {
      // 在组件实例进入页面节点树时执行
      await aC.where({
        qID: this.data.questionID
      }).count().then(res => {
        this.setData({
          commentCount: res.total
        })
      }).catch(err => {
        console.log('请求数据库失败', err)
      })
    }
  },
  // 以下是旧式的定义方式，可以保持对 <2.2.3 版本基础库的兼容
  attached: async function () {
    // 在组件实例进入页面节点树时执行
    await aC.where({
      qID: this.data.questionID
    }).count().then(res => {
      this.setData({
        commentCount: res.total
      })
    }).catch(err => {
      console.log('请求数据库失败', err)
    })
  }
})