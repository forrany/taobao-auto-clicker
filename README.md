# 淘宝自动点击脚本

一个用于淘宝/天猫网站的自动点击脚本，可以在指定时间自动点击指定元素。主要用于抢购、领券等场景。

## 功能特点

- 🕒 支持定时执行
- 🎯 可视化元素选择器
- 🔄 自动重试机制
- 📊 实时状态显示
- 🎛️ 可控制开始/停止
- 🔍 智能选择器生成

## 安装说明

1. 首先安装 Tampermonkey 浏览器扩展
   - [Chrome 版本](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox 版本](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)

2. 点击下面的安装链接安装脚本：
   [安装脚本](安装链接) <!-- 这里需要添加实际的安装链接 -->

## 使用说明

![](https://pic-bed-1302552283.cos.ap-guangzhou.myqcloud.com/20241102112324.png?imageMogr2/format/webp)

1. **设置执行时间**
   - 在控制面板中设置想要执行的具体时间
   - 支持精确到秒的时间设置

2. **选择目标元素**
   - 方法一：直接在输入框中输入 CSS 选择器
   - 方法二：点击"选择元素"按钮，通过可视化方式选择目标元素
     - 鼠标悬停时会高亮显示当前元素
     - 点击目标元素后可以选择合适的选择器
     - 支持 ESC 键退出选择模式

3. **开始/停止**
   - 点击"开始"按钮启动自动点击
   - 点击"停止"按钮随时终止操作
   - 可以通过最小化按钮缩小控制面板

## 注意事项

- 脚本会在指定时间自动执行点击操作
- 每次点击操作间隔为 10ms
- 最大点击次数限制为 20 次
- 如果页面刷新，脚本会自动保存状态并继续执行
- 当元素内容变为"去使用"时会自动停止点击

## 开发者信息

作者：Vincent Ko
- 个人网站：[https://vincentko.top/](https://vincentko.top/)
- GitHub：[https://github.com/forrany](https://github.com/forrany)

## 更新日志

### v0.5
- 优化元素选择器功能
- 改进状态管理机制
- 优化用户界面
- 添加作者信息

### v0.4
- 自动选择器版本发布
- 实现基本的自动点击功能
- 添加定时执行功能
- 添加元素选择器

### v0.3
- 优化脚本停止逻辑
- 修复脚本停止后无法再次启动的问题

### v0.2
- 添加手动开始和停止脚本的功能

### v0.1
- 自动执行版本
- 手动输入css选择器
- 初版发布

## 许可证

MIT License

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进这个脚本！

1. Fork 这个仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 支持

如果你在使用过程中遇到任何问题，可以：
- 提交 Issue
- 访问作者网站获取帮助
- 通过 GitHub 联系作者 