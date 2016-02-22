'use strict';

const ipcRenderer = require('electron').ipcRenderer;

const rendering = require('./rendering');
const notification = require('./notifications/alert').notification;
const performance = require('./performance/performance.js');
const t = require('./applicationMenu.js');

ipcRenderer.on('display-graph', (event, obj) => {
  rendering.onLoad(obj);
});

var exampleGraph = document.querySelector('#example-graph');
exampleGraph.addEventListener('click', () => {
  rendering.preview('graph');
});

var exampleMesh = document.querySelector('#example-mesh');
exampleMesh.addEventListener('click', () => {
  rendering.preview('mesh');
});

var effect = document.querySelector('#head-example');
effect.addEventListener('click', () => {
  performance.changeOpacity(true);
});

var showNotification = document.querySelector('#show-notification');
showNotification.addEventListener('click', () => {
  notification('TITLE', 'This is a notification', 'notification');
});

t.createApplicationMenu();
rendering.intro();
