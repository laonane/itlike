// components/searchBar/searchBar.js
let VALUE = ''

Component({
  /**
   * 组件的属性列表
   */
  properties: {

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
    _handlerInput(evt) {
      VALUE = evt.detail.value
    },
    _handlerPublish(evt) {
      this.triggerEvent('publish')
    },
    _handlerSearch(evt) {
      this.triggerEvent('search', {
        value: VALUE
      })
    }
  }
})