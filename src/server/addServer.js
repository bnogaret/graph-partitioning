'use strict';

const ipcRenderer = require('electron').ipcRenderer;

const buttonClose = document.querySelector('#button-close');
buttonClose.addEventListener('click', () => {
  window.close();
});

const buttonSave = document.querySelector('#button-save');
buttonSave.addEventListener('click', () => {
  const defaultPath = document.getElementById('defaultPath').value,
    host = document.getElementById('host').value,
    port = document.getElementById('port').value,
    username = document.getElementById('username').value;

  ipcRenderer.send('add-server', {
    'host': host,
    'username': username,
    'port': port,
    'defaultPath': defaultPath,
  });
  window.close();
});
