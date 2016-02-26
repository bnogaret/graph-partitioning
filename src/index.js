'use strict';

const ipcRenderer = require('electron').ipcRenderer;

const rendering = require('./rendering');
const notification = require('./notifications/alert').notification;
const performance = require('./performance/performance.js');
const t = require('./applicationMenu.js');

ipcRenderer.on('display-graph', (event, obj) => {
  rendering.onLoad(obj);
});

ipcRenderer.on('display-notification', (event, message, type) => {
  notification(message, type);
});

var exampleGraph = document.querySelector('#example-graph');
exampleGraph.addEventListener('click', () => {
  rendering.preview('graph');
});

var exampleMesh = document.querySelector('#example-mesh');
exampleMesh.addEventListener('click', () => {
  rendering.preview('mesh');
});

var overlay = document.querySelector('#overlay');
overlay.addEventListener('click', () => {
  overlay.style.display = 'none';
});

setTimeout(() => {
  overlay.style.display = 'none';
}, 20000);

ipcRenderer.on('performance', (event, obj) => {
  console.log('\n INDEXHTML PERFORMANCE: \n' + obj + '\n');
  performance.perf(obj);
});

t.createApplicationMenu();
rendering.intro();
