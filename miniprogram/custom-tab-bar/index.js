// miniprogram/coustom-tab-bar/index.js
Component({

  /**
   * 页面的初始数据
   */
  data: {
    selected: 0,
    color: "#707070",
    selectedColor: "#CD0000",
    backgroundColor: "#FFFFFF",
    list: [{
      "pagePath": "/pages/course/course",
      "text": "撩课程",
      "iconPath": "/images/icon/course-normal.png",
      "selectedIconPath": "/images/icon/course-selected.png"
    }, {
      "pagePath": "/pages/discussion/discussion",
      "text": "谈论区",
      "iconPath": "/images/icon/discuss-normal.png",
      "selectedIconPath": "/images/icon/discuss-selected.png"
    }, {
      "pagePath": "/pages/mine/mine",
      "text": "我的",
      "iconPath": "/images/icon/mine-normal.png",
      "selectedIconPath": "/images/icon/mine-selected.png"
    }]
  },

  methods: {
    _handlerTap(evt) {
      const _index = evt.currentTarget.dataset.index
      console.log(_index)
      const _url = this.data.list[_index].pagePath
      console.log(_url)
      wx.switchTab({
        url: _url
      })
      this.setData({
        selected: _index
      })
    }
  }
})