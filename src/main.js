'use strict';

const electron = require('electron');
const app = electron.app; // Module to control application life.
const BrowserWindow = electron.BrowserWindow; // Module to create native browser window.e()
const ipcMain = require('electron').ipcMain;
const executionLib = require('./executionLib');

const localDatabase = require('./db/localDatabase.js').localDatabase;
const test = require('./ssh/process.js').process;

var receivedPath = null;
// Report crashes to our server.
electron.crashReporter.start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

function randomIntInc () {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 1000,
  });

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  console.log('My platform: ' + process.platform);
  console.log(app.getAppPath());

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  if (typeof Notification === 'undefined') {
    console.log('Notification not available');
  }

  const db = new localDatabase();

  ipcMain.on('add-server', (event, server) => {
    server.id = randomIntInc();
    db.addServer(server);
  });

  // get file path from applicationMenu
  ipcMain.on('graph-path', (event, fp) => {
    receivedPath = fp;
  });

  // TODO for mesh
  ipcMain.on('exec-configuration', (event, obj) => {
    if (obj.visResultsCheckBox === true) {
      mainWindow.webContents.send('display-graph', receivedPath);
    }

    if (obj.metisRadioValue) {
      console.log('\nValues send from UI:');
      console.log('numberOfPartitions: ' + obj.numberOfPartitions);
      console.log('ctype: ' + obj.ctype);
      console.log('maxImbalance: ' + obj.maxImbalance);
      console.log('niter: ' + obj.niter);
      console.log('ptype: ' + obj.ptype);
      console.log('iptype: ' + obj.iptype);
      console.log('objtype: ' + obj.objtype);
      console.log('\n');

      if (obj.remoteServerId) {
        const server = db.getServer(obj.remoteServerId);
        console.log(server);
        // TODO: ask password and execute
      } else {
        executionLib.execGpMetis(receivedPath, obj.numberOfPartitions, {});
      }
    } else if (obj.parMetisRadioValue) {
      console.log('\nValues send from UI:');
      console.log('procsInputParMetis: ' + obj.procsInputParMetis);
      console.log('numberOfPartsParMetis: ' + obj.numberOfPartsParMetis);
      console.log('maxImbalanceParMetis: ' + obj.maxImbalanceParMetis);
      console.log('\n');

      if (obj.remoteServerId) {
        const server = db.getServer(obj.remoteServerId);
        console.log(server);
        // TODO: ask password and execute
      } else {
        // TODO add parmetis execution
      }
    } // TODO other libraries for linux
  });

  // const server = db.getServers().first();
  // const file = '**';
  // const password = '**';
  // const library = 'gpmetis';
  // const nparts = 4;
  // console.log(server);
  // test(server, file, password, library, nparts);
  // console.log(randomIntInc());
  // console.log(db.getServer('1645839638'));

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
