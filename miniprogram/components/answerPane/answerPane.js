// components/answerPane/answerPane.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isModal: {
      type: Boolean,
      value: false
    }
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
    _handlerSubmit(evt) {
      let content = evt.detail.value.content.trim()
      if (content.length === 0) {
        wx.showModal({
          title: '友情提示',
          content: '不能发表空的内容，请输入数据后发布!'
        })
      } else {
        this.triggerEvent('publishAnswer', {
          content
        })
      }
    }
  }
})