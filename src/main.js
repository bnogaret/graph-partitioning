'use strict';

const electron = require('electron');
const app = electron.app; // Module to control application life.
const BrowserWindow = electron.BrowserWindow; // Module to create native browser window.e()
const ipcMain = require('electron').ipcMain;
const executionLib = require('./executionLib');

const localDatabase = require('./db/localDatabase.js').localDatabase;
const SSHFile = require('./ssh/SSHFile').SSHFile;
const SSHShell = require('./ssh/SSHShell').SSHShell;

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

  // get file path from applicationMenu
  ipcMain.on('file-path', (event, fp) => {
    receivedPath = fp;
  });


  ipcMain.on('exec-configuration', (event, obj) => {
    if ((obj.metisRadioValue === true) && (obj.parMetisRadioValue === false)) {
      console.log('ReceivedPath: ' + receivedPath);
      executionLib.execGpMetis(receivedPath, 4);
      
      if(obj.visResultsCheckBox === true)
        {
          mainWindow.webContents.send('display-graph', receivedPath);
        }
      

      console.log('METIS = TRUE!');
    } else if ((obj.metisRadioValue === false) && (obj.parMetisRadioValue === true)) {
      console.log('parMETIS = TRUE!');
    } else {
      // TODO: condition if user choose running calculations remotely
    }
  });

  const config = {
    'host': '**',
    'username': '**',
    'port': 22,
    'password': '**',
    'tryKeyboard': true,
  };

  const commands = [
    'module load metis',
    'pwd',
    'hfdsuiodkl',
  ];

  /*
  const f = new SSHFile(config);
  f.addListener('ready', () => {
    f.uploadFile('...', '...');
  });
  f.addListener('success', () => {
    f.disconnect();
  });
  f.addListener('error', (event, err) => {
    console.log(err);
    f.disconnect();
  });
  f.connect();

  const s = new SSHShell(config);
  s.addListener('ready', () => {
    s.executeCommands(commands);
  });
  s.addListener('success', () => {
    s.disconnect();
  });
  s.addListener('error', (event, err) => {
    console.log(err);
    s.disconnect();
  });
  s.connect();

  const f2 = new SSHFile(config);
  f2.addListener('ready', () => {
    f2.downloadFile('...', '...');
  });
  f2.addListener('success', () => {
    f2.disconnect();
  });
  f2.addListener('error', (event, err) => {
    console.log(err);
    f2.disconnect();
  });
  f2.connect();
  */

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
