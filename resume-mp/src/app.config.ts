export default defineAppConfig({
  pages: [
    "pages/index/index",
    "pages/auth/index",
    "pages/mine/index",
  ],
  tabBar: {
    color: "#999",
    selectedColor: "#333",
    list: [
      {
        pagePath: 'pages/index/index',
        selectedIconPath: "static/home-selected.png",
        iconPath: "static/home-default.png",
        text: '首页',
      },
      {
        pagePath: 'pages/mine/index',
        selectedIconPath: "static/user-selected.png",
        iconPath: "static/user-default.png",
        text: '我的',
      },
    ],
  },
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "轻简历",
    navigationBarTextStyle: "black",
  },
});
