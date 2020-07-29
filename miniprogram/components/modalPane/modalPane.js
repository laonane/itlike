// components/modalPane/modalPane.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isModal: Boolean,
    modalTitle: String
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
    _handlerClose() {
      this.setData({
        isModal: false
      })
    }
  }
})
