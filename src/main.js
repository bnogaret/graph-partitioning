'use strict';

const electron = require('electron');
const app = electron.app; // Module to control application life.
const BrowserWindow = electron.BrowserWindow; // Module to create native browser window.e()
const ipcMain = require('electron').ipcMain;

const localDatabase = require('./db/localDatabase.js').localDatabase;

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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 1000,
  });

  // applicationMenu.createApplicationMenu();

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
    db.addServer(server);
  });

  ipcMain.on('exec-configuration', (event, obj) => {
    console.log(obj);
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
