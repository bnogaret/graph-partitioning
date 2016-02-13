'use strict';

const ipcRenderer = require('electron').ipcRenderer;

const buttonClose = document.querySelector('#button-close');
buttonClose.addEventListener('click', () => {
  window.close();
});