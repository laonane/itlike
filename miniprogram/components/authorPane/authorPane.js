// components/authorPane/authorPane.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isModal: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    _handlerUserInfor(evt){
      let userInfo = evt.detail.userInfo || {}
      // 1. 没有授权-拒绝 内部处理掉
      if (userInfo.nickName !== undefined) {
        this.triggerEvent("authorSuccess", {userInfo: userInfo})
      } else {
        wx.showToast({
          image: '/images/error.png',
          title: '授权方可使用'
        })
      }
    }
  }
})
