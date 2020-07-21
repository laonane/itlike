// miniprogram/pages/course/course.js
let currentPage = 1;

Page({
  _loadStageData(pageNum = 1, pageSize = 2) {
    this.setData({
      isLoading: true,
    })
    wx.cloud.callFunction({
      name: 'getStageData',
      data: {
        pageNum: pageNum,
        pageSize: pageSize
      },
      success: res => {
        // console.log('请求成功', res)
        if (res.result.data.length > 0) {
          currentPage++
          // console.log(currentPage)
        }
        this.setData({
          isLoading: false,
          stageData: this.data.stageData.concat(res.result.data)
        })
      },
      fail: err => {
        console.error(err)
      },
      complete: () => {
        this.setData({
          isLoading: false,
        })
      }
    })
  },
  _handlerLoadMoreTap: function (evt) {
    this._loadStageData(currentPage)
  },
  _updateComents(index) {
    // let index = evt.detail.current
    let currentItem = this.data.freeLive[index]
    let comments = currentItem.comments
    this.setData({
      currentComents: comments
    })
  },
  _handlerChange(evt) {
    let index = evt.detail.current
    let currentItem = this.data.freeLive[index]
    let comments = currentItem.comments
    this.setData({
      currentComents: comments
    })
  },
  _handlerHref(evt) {
    // console.log(evt)
    let obj = evt.currentTarget.dataset.mini
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
    liveClass: {},
    freeLive: [],
    currentComents: [],
    stageData: [],
    isLoading: false,
    videoInfo: {}
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
      }),
      wx.cloud.callFunction({
        name: 'getFreeLive',
        success: res => {
          this.setData({
            freeLive: res.result
          }, () => {
            if (res.result.length > 0) {
              this._updateComents(0)
            }
          })
        },
        fail: err => {
          console.error(err)
        }
      }),
      this._loadStageData(currentPage),
      wx.cloud.callFunction({
        name: 'getAboutUs',
        success: res => {
          // console.log(res)
          this.setData({
            videoInfo: res.result[0]
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