// components/stageCard/stageCard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    stageM: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isOpen: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _handlerOpen: function (evt) {
      this.setData({
        isOpen: !this.data.isOpen
      })
    },
    _handlerHref: function (evt) {
      let obj = evt.currentTarget.dataset.mini
      // console.log(obj)
      obj.fail = function () {
        wx.showToast({
          image: "/images/error.png",
          title: '打开三方小程序失败!'
        })
      }
      wx.navigateToMiniProgram(obj)
    }
  }
})