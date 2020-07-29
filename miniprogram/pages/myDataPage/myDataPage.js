// pages/myDataPage/myDataPage.js
let qCurrentPage = 1
let qCount = 5
let type = ''

Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionList: [],
    // answerList: [],
    isLoadMore: false
  },
  /**
   * 我的提问列表获取
   */
  async _getMyQuestionList() {
    this.setData({
      isLoadMore: true
    })
    await wx.cloud.callFunction({
      name: 'getMyQuestions',
      data: {
        pageSize: qCurrentPage,
        count: qCount
      }
    }).then(res => {
      this.setData({
        isLoadMore: false
      })
      // console.log('我的问题', res)
      if (qCurrentPage === 1) {
        this.setData({
          questionList: res.result
        })
      } else {
        this.setData({
          questionList: this.data.questionList.concat(res.result)
        })
      }
      if (res.result.length > 0) {
        qCurrentPage++
      }
    }).catch(err => {
      this.setData({
        isLoadMore: false
      })
      console.error('我的问题获取错误', err)
    })
  },
  /**
   * 我的回答列表获取
   */
  async _getMyAnswersList() {
    this.setData({
      isLoadMore: true
    })
    await wx.cloud.callFunction({
      name: 'getMyAnswers',
      data: {
        pageSize: qCurrentPage,
        count: qCount
      }
    }).then(res => {
      this.setData({
        isLoadMore: false
      })
      // console.log('我的回答', res)
      if (qCurrentPage === 1) {
        this.setData({
          questionList: res.result
        })
      } else {
        this.setData({
          questionList: this.data.questionList.concat(res.result)
        })
      }
      if (res.result.length > 0) {
        qCurrentPage++
      }
    }).catch(err => {
      this.setData({
        isLoadMore: false
      })
      console.error('我的回答获取错误', err)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // wx.showLoading({
    //   title: '数据加载中',
    // })
    type = options.type
    qCurrentPage = 1
    if (type === "answer") {
      wx.setNavigationBarTitle({
        title: '我的回答',
      })
      await this._getMyAnswersList()
      // wx.hideLoading()
    }
    if (type === "question") {
      wx.setNavigationBarTitle({
        title: '我的提问',
      })
      await this._getMyQuestionList()
      // wx.hideLoading()
    }
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (type === "answer") {
      this._getMyAnswersList()
    }
    if (type === "question") {
      this._getMyQuestionList()
    }
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
        path: "/pages/questionDetail/questionDetail?qid=" + questionID
      }
    }
  }
})