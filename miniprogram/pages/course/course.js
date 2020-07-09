// miniprogram/pages/course/course.js
Page({
  _handlerHref() {
    let obj = this.data.liveClass[0].jumpMiniPro
    // console.log(obj)
    obj.fail = function () {
      wx.showToast({
        image: "/images/icon/error.png",
        title: '打开三方小程序失败!'
      })
    }
    wx.navigateToMiniProgram(obj)
  },
  /**
   * 页面的初始数据
   */
  data: {
    liveClass: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: 'getLiveClass',
      success: res => {
        // console.log(res)
        this.setData({
          liveClass: res.result
        })
      },
      fail: err => {
        console.error(err)
      }
    })
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
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})