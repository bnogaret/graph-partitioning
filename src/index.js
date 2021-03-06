'use strict';

const ipcRenderer = require('electron').ipcRenderer;

const rendering = require('./rendering');
const notification = require('./notifications/alert').notification;
const upload = require('./notifications/alert');
const performance = require('./performance/performance.js');
const t = require('./applicationMenu.js');
var isMesh = null;

function isLinux() {
  return (navigator.appVersion.indexOf('Linux') !== -1);
}

ipcRenderer.on('isMesh', (event, obj) => {
  isMesh = obj;
});

ipcRenderer.on('display-graph', (event, obj) => {
  notification('Load: ' + obj.p, 'notification');
  rendering.setNumberOfPartitions(obj.n);
  rendering.isMesh(obj.isMesh);
  rendering.setLibrary(obj.library);
  rendering.onLoad(obj.p);
});

ipcRenderer.on('display-notification', (event, message, type) => {
  notification(message, type);
});

var exampleGraph = document.querySelector('#example-graph');
exampleGraph.addEventListener('click', () => {
  performance.hide();
  rendering.preview('graph');
});

var exampleMesh = document.querySelector('#example-mesh');
exampleMesh.addEventListener('click', () => {
  performance.hide();
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

ipcRenderer.on('performance', (event, obj, library) => {
  // Not same result when its a mesh
  performance.setMesh(isMesh);
  if (library === 'chaco') {
    performance.perfChaco(obj);
  } else if (library === 'parmetis' && isLinux()) {
    performance.perfParmetis(obj);
  } else {
    performance.perf(obj);
  }
});

ipcRenderer.on('upload', (event, obj) => {
  switch (obj.step) {
    case 'upload_start':
      upload.init(obj.message);
      break;
    case 'upload_step':
      upload.progressSpinner(obj.step, obj.data, obj.message);
      break;
    case 'upload_end':
      upload.progressSpinner(obj.step, obj.data, obj.message);
      break;
    case 'download_start':
      upload.progressSpinner(obj.step, obj.data, obj.message);
      break;
    case 'download_step':
      upload.progressSpinner(obj.step, obj.data, obj.message);
      break;
    case 'download_end':
      upload.progressSpinner(obj.step, obj.data, obj.message);
      break;
    default:
      break;
  }
});

t.createApplicationMenu();
rendering.intro();
