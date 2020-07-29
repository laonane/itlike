let content = ""
const MAXIMAGECOUNT = 6
let deviceMsg = ''
Page({
  /**
   * 图片检测函数，存在违规则返回{success: 0}, 正常返回 {success:1}
   * @param {Object} images 图片列表
   * @param {function} callback 回调函数
   */
  _checkImagesContent(images, callback) {
    if (images.length === 0) {
      callback({
        success: 1
      }, [])
      return
    }
    wx.showLoading({
      title: '图片检测中...',
    })
    // 对图片进行监测
    let promiseList = []
    for (let i = 0; i < images.length; i++) {
      let imagePath = images[i];

      // 获取图片扩展名
      let extName = /\.\w+$/.exec(imagePath)[0]
      // 定义唯一文件名
      let urlName = 'itlike/questionImages/' + Date.now() + Math.random() * 1000 + extName
      // console.log(urlName)

      // 获取结果
      let promise = wx.cloud.uploadFile({
        cloudPath: urlName,
        filePath: imagePath
      })
      // 保存 promise 对象
      promiseList.push(promise)
    }
    /**
     * Promise.all 当所有的异步任务执行结束之后才会返回true，其中有错误则中断返回错误信息
     */
    Promise.all(promiseList).then(res => {
      let fileIDs = res.map(val => val.fileID)
      // console.log('所有图片上传成功', fileIDs)
      wx.cloud.callFunction({
        name: 'imagesCheck',
        data: {
          fileIDs: fileIDs
        },
        success: res => {
          wx.hideLoading()
          // console.log(res)
          let success = res.result.success
          callback(success, fileIDs)
        },
        fail: err => {
          wx.hideLoading()
          // console.error('失败回调', err)
        }
      })
    }).catch(err => {
      // console.error('有些图片上传失败', err)
      wx.showToast({
        mask: true,
        title: '图片上传失败',
        image: '/images/error.png'
      })
    })
  },
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
  _publishContent(userinfo, location, content, fileIDs, deviceMsg) {
    wx.showLoading({
      title: '内容发布中···',
    })
    let db = wx.cloud.database()
    let questionC = db.collection('questions')
    questionC.add({
      data: {
        userinfo,
        location,
        question: {
          content,
          fileIDs
        },
        deviceMsg,
        createTime: db.serverDate()
      }
    }).then(res => {
      wx.hideLoading()
      wx.showToast({
        title: '内容发布成功!',
        complete: () => {
          wx.navigateBack()
          // getCurrentPages() 获取所有的页面栈
          let pages = getCurrentPages()
          let prePage = pages[pages.length - 2]
          prePage.onPullDownRefresh()
        }
      })
      // console.log('问题添加到数据库成功', res)
    }).catch(err => {
      wx.hideLoading()
      // console.log('问题添加到数据库失败', err)
    })
  },
  /**
   * 发布事件处理
   */
  _handlerPublish(evt) {
    let userinfo = this.data.userInfo
    let location = this.data.userLocation
    let _content = content
    let images = this.data.chooseImages
    this._checkMsgContent(_content, () => {
      // console.log('文本监测成功')
      this._checkImagesContent(images, (success, fileIDs) => {
        if (success) {
          // console.log(success, fileIDs)
          this._publishContent(userinfo, location, _content, fileIDs, deviceMsg)
        } else {
          wx.showToast({
            mask: true,
            title: '图片违法违规',
            image: '/images/error.png'
          })
        }
      })
    })
  },
  /**
   * 预览图片
   */
  _handlerPreviewImage(evt) {
    wx.previewImage({
      current: evt.currentTarget.dataset.src,
      urls: this.data.chooseImages,
    })
  },
  /**
   * 点击删除图片
   */
  _handlerDeleteImage(evt) {
    // console.log(evt)
    let index = evt.currentTarget.dataset.index
    this.data.chooseImages.splice(index, 1)
    this.setData({
      chooseImages: this.data.chooseImages
    })
  },
  /**
   * 添加图片按钮
   */
  _handlerChooseImage(evt) {
    wx.chooseImage({
      count: MAXIMAGECOUNT - this.data.chooseImages.length,
      success: res => {
        this.setData({
          chooseImages: this.data.chooseImages.concat(res.tempFilePaths)
        })
      }
    })
  },
  /**
   * 选择位置信息
   */
  _chooseLocation() {
    wx.chooseLocation({
      latitude: this.data.userLocation.latitude,
      longitude: this.data.userLocation.longitude,
      success: (res) => {
        // console.log(res)
        delete res['errMsg']
        this.setData({
          userLocation: res
        })
      }
    })
  },
  /**
   * 位置信息处理
   */
  _handlerLocation(evt) {
    wx.getSetting({
      success: (res) => {
        // console.log(res)
        if (res.authSetting['scope.userLocation']) {
          this._chooseLocation()
        } else {
          // console.log('未授权')
          wx.authorize({
            scope: 'scope.userLocation',
            success: (res) => {
              this._chooseLocation()
            },
            fail: err => {
              // console.log('授权失败', err)
              wx.showModal({
                title: '位置信息获取失败',
                content: '未授权，是否进入设置中授于位置信息的权限？',
                success: (res) => {
                  if (res.confirm) {
                    wx.openSetting({
                      withSubscriptions: true,
                      success: res => {
                        if (res.authSetting['scope.userLocation']) {
                          this._chooseLocation()
                        }
                      }
                    })
                  } else if (res.cancel) {
                    wx.showToast({
                      title: '无法获取位置',
                      image: '/images/error.png',
                    })
                  }
                }
              })
            }
          })
        }
      }
    })
  },
  /**
   * 键盘失去焦点
   */
  _handlerBlur(evt) {
    // console.log(evt)
    this.setData({
      publishBarToBottom: 0
    })
  },
  /**
   * 获取键盘焦点
   */
  _handlerFocus(evt) {
    // console.log(evt)
    this.setData({
      publishBarToBottom: evt.detail.height
    })
  },
  _handlerInput(evt) {
    // console.log(evt.detail.value)
    content = evt.detail.value
    this.setData({
      leftLength: this.data.maxLength - content.length,
      canPublish: content.trim().length != 0
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    maxLength: 150,
    leftLength: 150,
    canPublish: false,
    publishBarToBottom: 0,
    userLocation: {},
    chooseImages: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 方案1 
    // let app = getApp()
    // let userInfo = app.globalData.userInfo
    // console.log(userInfo)

    // 方案2: url?pa1=v1&pa2=v2
    // console.log(options)

    // 方案3: eventChannel
    let ec = this.getOpenerEventChannel()
    ec.on && ec.on("getUserInfoEvent", res => {
      console.log("触发了获取用户信息的事件", res)
      this.setData({
        userInfo: res.userInfo
      })
    })

    // 获取设备信息
    wx.getSystemInfo({
      success: (res) => {
        // console.log(res)
        // delete res['errMsg']
        let model = res.model.split('<')
        deviceMsg = model
      },
      fail: (res) => {},
      complete: (res) => {},
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