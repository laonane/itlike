// miniprogram/pages/discussion/discussion.js
const pageSize = 5
let currentPage = 1
let key = ''
Page({
  _handlerUserInfo(userInfo) {
    // console.log('授权成功', userInfo)
    wx.navigateTo({
      url: '/pages/publish/publish',
      success: res => {
        res.eventChannel.emit('getUserInfoEvent', {
          userInfo
        })
      }
    })
  },
  _handlerAuthorSuccess(evt) {
    // console.log("授权成功", evt.detail.userInfo)
    // 后续事情
    this.setData({
      isModal: false
    })
    this._handlerUserInfo(evt.detail.userInfo)

  },
  _handlerSearchFunc(evt) {
    // console.log(evt.detail)
    key = evt.detail.value
    wx.startPullDownRefresh()
  },
  _handlerPublishFunc(evt) {
    // console.log('点击了发表按钮')
    wx.getSetting({
      withSubscriptions: true,
      success: res => {
        // console.log(res)
        let result = res.authSetting['scope.userInfo']
        if (result) {
          wx.getUserInfo({
            success: res => {
              // console.log(res)
              let userInfo = res.userInfo
              this._handlerUserInfo(userInfo)
            }
          })
        } else {
          // console.log("没有授权, 应该弹出一个窗口(按钮 open-type = 'getUserInfo')")
          this.setData({
            isModal: true
          })
        }
      }
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    isModal: false,
    questionList: [],
    isLoadingMore: false,
    commentCount: 0
  },

  /**
   * 加载问题列表数据
   * @param {number} pageNum 当前页码
   */
  _loadQuestionsData(pageNum = 1, successCallback) {
    this.setData({
      isLoadingMore: true
    })
    currentPage = pageNum
    wx.cloud.callFunction({
      name: 'questions',
      data: {
        start: pageNum,
        count: pageSize,
        key: key
      }
    }).then(res => {
      this.setData({
        isLoadingMore: false
      })
      successCallback(res.result)
    }).catch(err => {
      console.error('函数加载失败', err)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    wx.startPullDownRefresh()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // console.log('下拉刷新')
    this._loadQuestionsData(1, res => {
      // console.log('下拉刷新', res)
      wx.stopPullDownRefresh()
      this.setData({
        questionList: res
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._loadQuestionsData(++currentPage, res => {
      wx.stopPullDownRefresh()
      // console.log('触底反弹', res)
      if (res.length === 0) {
        --currentPage
      }
      this.setData({
        questionList: this.data.questionList.concat(res)
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (evt) {
    if (evt.target) {
      let questionID = evt.target.dataset.questionid
      let result = this.data.questionList.filter(v => v._id === questionID)[0]
      return {
        title: result.question.content,
        imageUrl: result.question.fileIDs[0],
        path: ''
      }
    }
  }
})