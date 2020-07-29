// components/questionCard/questionCard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    questionM: {
      type: Object,
      value: {}
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
    _handlerPreviewImage(evt) {
      wx.previewImage({
        urls: this.data.questionM.question.fileIDs,
        current: evt.currentTarget.dataset.src
      })
    }
  }
})
