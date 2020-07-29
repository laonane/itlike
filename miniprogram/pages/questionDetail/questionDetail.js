// pages/questionDetail/questionDetail.js
let db = wx.cloud.database()
let questionC = db.collection('questions')
let commentC = db.collection('answers')

const PAGE_SIZE = 3
let currentPageNum = 1
let questionID = ''

Page({
  _handlerCommentSuccess() {
    wx.startPullDownRefresh()
  },
  /**
   * 分页加载 + 下拉刷新
   */
  _handlerLoadMore() {
    // console.log('questionID', this.data.questionM._id)
    this.setData({
      isLoading: true
    })
    wx.cloud.callFunction({
      name: 'comments',
      data: {
        start: currentPageNum,
        count: PAGE_SIZE,
        questionID: questionID
      }
    }).then(res => {
      this.setData({
        isLoading: false
      })
      if (currentPageNum === 1) {
        this.setData({
          commentM: res.result
        })
      } else {
        this.setData({
          commentM: this.data.commentM.concat(res.result)
        })
      }
      if (res.result.length > 0) {
        ++currentPageNum
      }
    }).catch(err => {
      // console.log('分页数据加载失败', err)
      this.setData({
        isLoading: false
      })
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    questionM: {},
    commentM: [],
    isLoading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    questionID = options.qid
    let question = questionC.where({
      _id: questionID
    }).limit(1).get().then(res => {
      // console.log('问题获取成功', res.data[0])
      res.data[0].createTime = res.data[0].createTime.toString()
      this.setData({
        questionM: res.data[0]
      })
    }).catch(err => {
      console.error('问题请求失败', err)
    })
    this._handlerLoadMore()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // console.log('onshow 生命周期函数--监听页面显示')
    // this._handlerLoadMore()
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    currentPageNum = 1
    this._handlerLoadMore()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._handlerLoadMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (evt) {
    // console.log('分享按钮被触发', evt)
    if (this.data.questionM._id) {
      // let questionID = evt.target.dataset.questionid
      return {
        title: this.data.questionM.question.content,
        imageUrl: this.data.questionM.question.fileIDs[0],
        path: "/pages/questionDetail/questionDetail?qid=" + this.data.questionM._id
      }
    }
  }
})