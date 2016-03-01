'use strict';

const ipcRenderer = require('electron').ipcRenderer;

const rendering = require('./rendering');
const notification = require('./notifications/alert').notification;
const performance = require('./performance/performance.js');
const t = require('./applicationMenu.js');

ipcRenderer.on('display-graph', (event, obj) => {
  notification('Load: ' + obj.p, 'notification');
  rendering.setNumberOfPartitions(obj.n);
  rendering.isMesh(obj.isMesh);
  rendering.onLoad(obj.p);
});

ipcRenderer.on('display-notification', (event, message, type) => {
  notification(message, type);
});

// ipcRenderer.on('error', (event, obj) => {
//   notification(obj, 'alert');
// });

// ipcRenderer.on('check-error', (event, obj) => {
//   console.log('\n CHECK ERROR \n' + obj);
//   if (/Missing parameters/.test(obj)) {
//     notification(obj, 'alert');
//   }
//   if (/ERROR/.test(obj)) {
//     notification(obj, 'alert');
//   }
// });

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


function showOverlay() {
  overlay.style.display = 'block';
  setTimeout(() => {
    overlay.style.display = 'none';
  }, 20000);
}

var about = document.querySelector('#about');
about.addEventListener('click', showOverlay);

ipcRenderer.on('performance', (event, obj) => {
  performance.perf(obj);
});

t.createApplicationMenu();
rendering.intro();
