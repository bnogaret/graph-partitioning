'use strict';

const electron = require('electron');
const app = electron.app; // Module to control application life.
const BrowserWindow = electron.BrowserWindow; // Module to create native browser window.e()
const ipcMain = require('electron').ipcMain; // To communicate avec les windows
const EventEmitter = require('events').EventEmitter;

const executionLocalLib = require('./executionLocalLib.js');
const localDatabase = require('./db/localDatabase.js').localDatabase;
const sendToRemote = require('./ssh/process.js').process;

var receivedPath = null;
var isMesh = false;
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

function randomIntInc() {
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

  const db = new localDatabase();

  ipcMain.on('add-server', (event, server) => {
    server.id = randomIntInc().toString();
    db.addServer(server);
  });

  // get file path from applicationMenu
  ipcMain.on('exe-initialization', (event, fp, isMeshOption) => {
    receivedPath = fp;
    isMesh = isMeshOption;
  });

  let eventEmitter = new EventEmitter();

  /**
   * function which prepare data to be sent to exec file.We need to send appropriate data in accordance to different ptype parameter passed by user
   * @param {object} object
   * @return {object}
   */
  function processReceivedMetisData(object) {
    var executionParameters = {
      ptype: object.ptype,
      ctype: object.ctype,
      seed: object.seed,
      niter: object.niter,
      ufactor: object.maxImbalance,
    };

    if (object.ptype === 'rb') {
      executionParameters.iptype = object.iptype;
    } else if (object.ptype === 'kway') {
      executionParameters.objtype = object.objtype;
    }
    console.log(executionParameters);
    return executionParameters;
  }

  function processReceivedParMetisData(object) {
    const executionParameters = {
      nparts: object.numberOfPartitions,
      maxub: object.maxImbalanceParMetis,
      seed: object.seed,
    };
    console.log('FUNCTION processReceivedParMetisData returned data');
    return executionParameters;
  }

  function getPartitioningDimension(numberOfPartitions, partitioningDimension) {
    const np = parseInt(numberOfPartitions, 10);
    const pd = parseInt(partitioningDimension, 10);
    if (np < 4) {
      return '';
    } else if (np >= 4 && np <= 7 && (pd === 1 || pd === 2)) {
      return pd.toString();
    } else if (np > 7 && (pd > 0 && pd < 4)) {
      return pd.toString();
    }
    return '1';
  }

  function processReceivedChacoData(object) {
    let executionParameters = {
      partitioningMethod: object.partitioningMethod ? object.partitioningMethod : '5',
    };
    switch (object.partitioningMethod) {
    case '1': // Multilevel - Kernighan-Lin
      executionParameters.vertices = object.vertices;
      break;
    case '2': // Spectral
      executionParameters.eigensolver = object.eigensolver;
      executionParameters.vertices = object.eigensolver === '1' ? object.vertices : '';
      executionParameters.localRefinement = object.localRefinement;
      break;
    case '4': // Linear
    case '5': // Random
    case '6': // Scattered
    default:
      executionParameters.localRefinement = object.localRefinement;
      break;
    }
    executionParameters.numberOfPartitions = object.numberOfPartitions;
    executionParameters.partitioningDimension = getPartitioningDimension(object.numberOfPartitions, object.partitioningDimension);
    return executionParameters;
  }

  function sendNotification(message, type) {
    mainWindow.webContents.send('display-notification', message, type);
  }

  function processResult(result, error, stderr) {
    if (error) {
      sendNotification(error, 'alert');
    } else if (stderr) {
      sendNotification(new Error(stderr), 'alert');
    } else if (result) {
      mainWindow.webContents.send('performance', result);
      // mainWindow.webContents.send('check-error', result); // it can compute with error such as missing parameters
    }
  }

  ipcMain.on('exec-configuration', (event, obj) => {
    var parametersDisplay = {
      p: receivedPath,
      n: obj.numberOfPartitions,
      isMesh: isMesh,
    };

    if (obj.visResultsCheckBox === true) {
      mainWindow.webContents.send('display-graph', parametersDisplay);
    }

    console.log('\nValues send from UI:');
    console.log(obj);
    console.log('\n');

    if (obj.choiceLibrary === '1') {
      let params = processReceivedMetisData(obj);

      if (obj.remoteServerId) {
        const server = db.getServer(obj.remoteServerId);
        if (isMesh) {
          sendToRemote(server, obj.password, receivedPath, 'mpmetis', obj.numberOfPartitions, params, eventEmitter);
        } else {
          sendToRemote(server, obj.password, receivedPath, 'gpmetis', obj.numberOfPartitions, params, eventEmitter);
        }
      } else if (!isMesh) {
        executionLocalLib.execGpMetis(receivedPath, obj.numberOfPartitions, params, processResult);
      } else {
        executionLocalLib.execMpMetis(receivedPath, obj.numberOfPartitions, params, processResult);
      }
    } else if (obj.parMetisRadioValue === '2') {
      let params = processReceivedParMetisData(obj);

      if (obj.remoteServerId) {
        const server = db.getServer(obj.remoteServerId);
        sendToRemote(server, receivedPath, obj.password, 'parmetis', obj.numberOfPartitions, params, eventEmitter);
      } else {
        executionLocalLib.execParMetis(receivedPath, obj.procsInputParMetis, params, processResult);
      }
    } else if (process.platform === 'linux' && obj.choiceLibrary === '3' && !isMesh) {
      console.log(obj);
      let params = processReceivedChacoData(obj);
      console.log(params);
      executionLocalLib.execChaco(receivedPath, params, processResult);
    }
  });

  eventEmitter.on('error', (err) => {
    sendNotification(err.message, 'alert');
  }).on('upload-start', (host, file, defaultPath) => {
    sendNotification(`Connected to the server ${host}. Starting to upload the file ${file} in ${defaultPath}.`, 'notification');
  }).on('upload-step', (totalTransferred, total) => {

  }).on('upload-end', () => {
    sendNotification('Upload with success.', 'notification');
  }).on('command-start', () => {
    sendNotification('Starting the computation.', 'notification');
  }).on('command-result', (command, stdout) => {
    console.log(`Command: ${command}`);
    console.log(`Stdout: ${stdout}`);
  }).on ('command-end', () => {
    sendNotification('End of the computation.', 'notification');
  }).on('download-start', (fileName, fileDirectory) => {
    sendNotification(`Starting to download the result file. It will save the file as ${fileName} in ${fileDirectory}.`, 'notification');
  }).on('download-step', (totalTransferred, total) => {

  }).on('download-end', (host) => {
    sendNotification(`File downloaded with success. Deconnection from the remote server ${host}.`, 'notification');
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});