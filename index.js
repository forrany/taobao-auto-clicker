// ==UserScript==
// @name         淘宝自动点击脚本
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  在指定时间自动点击淘宝网站上的指定元素,可控制开始和停止
// @match        *://*.taobao.com/*
// @match        *://*.tmall.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// ==/UserScript==
(function() {
  'use strict';
  let executeTime = GM_getValue('executeTime', '');
  let targetSelector = GM_getValue('targetSelector', '');
  let isRunning = false;
  let timer = null;
  let clickCount = 0;
  const MAX_CLICKS = 20;
  // 从localStorage获取运行状态
  const storedState = localStorage.getItem('autoClickState');
  if (storedState) {
      const state = JSON.parse(storedState);
      isRunning = state.isRunning;
      clickCount = state.clickCount;
  }
  // 添加控制面板样式
  GM_addStyle(`
      #autoClickControl {
          position: fixed;
          top: 10px;
          right: 10px;
          z-index: 9999;
          background: #fff;
          border: 1px solid #ccc;
          padding: 15px;
          border-radius: 5px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          min-width: 300px;
          font-family: Arial, sans-serif;
      }
      #autoClickControl .control-header {
          font-weight: bold;
          margin-bottom: 10px;
          padding-bottom: 5px;
          border-bottom: 1px solid #eee;
      }
      #autoClickControl .control-item {
          margin-bottom: 10px;
      }
      #autoClickControl .control-item label {
          display: block;
          margin-bottom: 5px;
          color: #666;
          font-size: 12px;
      }
      #autoClickControl input {
          width: 100%;
          padding: 5px;
          border: 1px solid #ddd;
          border-radius: 3px;
          margin-bottom: 5px;
      }
      #autoClickControl .button-group {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
      }
      #autoClickControl button {
          padding: 5px 15px;
          border: none;
          border-radius: 3px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.3s;
      }
      #startAutoClick {
          background: #1890ff;
          color: white;
      }
      #stopAutoClick {
          background: #ff4d4f;
          color: white;
      }
      #startAutoClick:hover {
          background: #40a9ff;
      }
      #stopAutoClick:hover {
          background: #ff7875;
      }
      .status-text {
          font-size: 12px;
          color: #666;
          margin-top: 5px;
          text-align: center;
      }
      #autoClickControl .minimize-btn {
          position: absolute;
          right: 5px;
          top: 5px;
          cursor: pointer;
          padding: 2px 6px;
          background: #f0f0f0;
          border-radius: 3px;
          font-size: 12px;
      }
      #autoClickControl.minimized {
          min-width: auto;
          padding: 5px;
      }
      #autoClickControl.minimized .control-content {
          display: none;
      }
  `);
  // 创建控制面板
  const controlDiv = document.createElement('div');
  controlDiv.id = 'autoClickControl';
  controlDiv.innerHTML = `
      <div class="minimize-btn">_</div>
      <div class="control-content">
          <div class="control-header">自动点击控制面板</div>
          <div class="control-item">
              <label>执行时间:</label>
              <input type="datetime-local" id="executeTimeInput" step="1">
          </div>
          <div class="control-item">
              <label>目标元素 (CSS选择器):</label>
              <input type="text" id="targetSelectorInput" placeholder="请输入CSS选择器">
          </div>
          <div class="button-group">
              <button id="startAutoClick">开始</button>
              <button id="stopAutoClick">停止</button>
          </div>
          <div class="status-text" id="statusText"></div>
      </div>
  `;
  document.body.appendChild(controlDiv);
  // 初始化面板数据
  const executeTimeInput = document.getElementById('executeTimeInput');
  const targetSelectorInput = document.getElementById('targetSelectorInput');
  const statusText = document.getElementById('statusText');
  // 如果有保存的值，则填充到输入框
  if (executeTime) {
      executeTimeInput.value = executeTime.replace(' ', 'T');
  }
  if (targetSelector) {
      targetSelectorInput.value = targetSelector;
  }
  // 最小化功能
  const minimizeBtn = controlDiv.querySelector('.minimize-btn');
  minimizeBtn.addEventListener('click', () => {
      controlDiv.classList.toggle('minimized');
      minimizeBtn.textContent = controlDiv.classList.contains('minimized') ? '+' : '_';
  });
  // 监听输入变化
  executeTimeInput.addEventListener('change', function() {
      executeTime = this.value.replace('T', ' ');
      GM_setValue('executeTime', executeTime);
      updateStatus();
  });
  targetSelectorInput.addEventListener('change', function() {
      targetSelector = this.value;
      GM_setValue('targetSelector', targetSelector);
      updateStatus();
  });
  // 更新状态显示
  function updateStatus() {
      const timeStr = executeTime ? new Date(executeTime).toLocaleString() : '未设置';
      const selectorStr = targetSelector || '未设置';
      statusText.innerHTML = `
          当前状态: ${isRunning ? '运行中' : '已停止'}<br>
          执行时间: ${timeStr}<br>
          目标元素: ${selectorStr}<br>
          点击次数: ${clickCount}/${MAX_CLICKS}
      `;
  }
  function clickElement() {
      const element = document.querySelector(targetSelector);
      if (element) {
          element.click();
          clickCount++;
          console.log(`点击元素 (${clickCount}/${MAX_CLICKS})`);
          updateStatus();
      } else {
          console.log('未找到目标元素');
      }
  }
  function checkPageChange() {
      return new Promise((resolve) => {
          const currentUrl = window.location.href;
          setTimeout(() => {
              resolve(currentUrl !== window.location.href);
          }, 100);
      });
  }

  function checkElementInnerHTML() {
      const element = document.querySelector(targetSelector);
      return element && element.innerHTML.includes("去使用");
  }

  async function performClicks() {
      for (let i = 0; i < MAX_CLICKS; i++) {
          if (!isRunning) return false;
          clickElement();
          // 检查目标元素的innerHTML是否变为"去使用"
          if (checkElementInnerHTML()) {
              console.log('目标元素的innerHTML变为"去使用"，停止点击');
              return true;
          }
          await new Promise(resolve => setTimeout(resolve, 10));
      }
      return false;
  }

  async function main() {
      if (!executeTime || !targetSelector) {
          statusText.textContent = '请先设置执行时间和目标元素';
          return;
      }
      const targetTime = new Date(executeTime).getTime();
      const now = new Date().getTime();
      if (now < targetTime) {
          const delay = targetTime - now;
          statusText.textContent = `将在 ${Math.floor(delay/1000)} 秒后执行点击操作`;
          timer = setTimeout(executeClickSequence, delay);
      } else {
          statusText.textContent = '指定时间已过,立即执行点击操作';
          executeClickSequence();
      }
  }
  async function executeClickSequence() {
      while (isRunning) {
          const hasPageChanged = await performClicks();
          if (hasPageChanged) {
              break;
          }
          console.log('刷新页面并重试');
          saveState();
          location.reload();
          return; // 防止刷新后继续执行
      }
  }
  function startAutoClick() {
      if (!isRunning) {
          if (!executeTime || !targetSelector) {
              alert('请先设置执行时间和目标元素');
              return;
          }
          isRunning = true;
          clickCount = 0;
          main();
          updateStatus();
          document.getElementById('startAutoClick').disabled = true;
          document.getElementById('stopAutoClick').disabled = false;
          saveState();
      }
  }
  function stopAutoClick() {
      isRunning = false;
      if (timer) {
          clearTimeout(timer);
          timer = null;
      }
      updateStatus();
      document.getElementById('startAutoClick').disabled = false;
      document.getElementById('stopAutoClick').disabled = true;
      saveState();
  }
  function saveState() {
      localStorage.setItem('autoClickState', JSON.stringify({
          isRunning: isRunning,
          clickCount: clickCount
      }));
  }
  // 绑定按钮事件
  document.getElementById('startAutoClick').addEventListener('click', startAutoClick);
  document.getElementById('stopAutoClick').addEventListener('click', stopAutoClick);
  // 初始化状态显示
  updateStatus();
  // 如果页面加载时脚本处于运行状态，则自动开始执行
  if (isRunning) {
      main();
  }
})();
