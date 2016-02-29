'use strict';

const electron = require('electron');
const app = electron.app; // Module to control application life.
const BrowserWindow = electron.BrowserWindow; // Module to create native browser window.e()
const ipcMain = require('electron').ipcMain;
const executionLib = require('./executionLib');

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

  if (typeof Notification === 'undefined') {
    console.log('Notification not available');
  }

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

  /**
   * function which prepare data to be sent to exec file.We need to send appropriate data in accordance to different ptype parameter passed by user
   * @param {object} object
   * @return {object}
   */
  function processReceivedMetisData(object) {
    let executionParameters = {};
    if (object.ptype === 'rb') {
      executionParameters = {
        ptype: object.ptype,
        ctype: object.ctype,
        iptype: object.iptype,
        seed: object.seed,
        niter: object.niter,
        ubvec: object.maxImbalance,
      };
      console.log('FUNCTION processReceivedData returns FOR: rb');
      return executionParameters;
    } else if (object.ptype === 'kway') {
      executionParameters = {
        ptype: object.ptype,
        ctype: object.ctype,
        objtype: object.objtype,
        niter: object.niter,
        seed: object.seed,
        ubvec: object.maxImbalance,
      };
      console.log('FUNCTION processReceivedData returns FOR: kway');
      return executionParameters;
    }
    return {};
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

  // TODO for mesh
  ipcMain.on('exec-configuration', (event, obj) => {
    var parametersDisplay = {
      p: receivedPath,
      n: obj.numberOfPartitions,
      isMesh: isMesh,
    };

    if (obj.visResultsCheckBox === true) {
      mainWindow.webContents.send('display-graph', parametersDisplay);
    }

    if (obj.choiceLibrary === '1') {
      console.log('\nValues send from UI:');
      console.log(obj);
      console.log('\n');

      if (obj.remoteServerId) {
        const server = db.getServer(obj.remoteServerId);

        console.log('Server: ' + server);
        // TODO: ask password and execute
        // password already in variable obj.password;
        console.log('PASSWORD IS: ' + obj.password);

        // sendToRemote(server, pathNumberOfPartitions.p, 'mpmetis', obj.numberOfPartitions, obj.password);
      } else {
        let params = processReceivedMetisData(obj);
        if (isMesh === false) {
          executionLib.execGpMetis(receivedPath, obj.numberOfPartitions, params, (result, error) => {
            if (error) {
              mainWindow.webContents.send('error', error);
            } else {
              mainWindow.webContents.send('performance', result);
              mainWindow.webContents.send('check-error', result); // it can compute with error such as missing parameters   
            }
          });
        } else {
          console.log('METIS IS GOING TO WORK FOR A MESH!');
          let gtype = 'nodal'; // should remain set staticly
          executionLib.execMpMetis(receivedPath, obj.numberOfPartitions, params, gtype, (result, error) => {
            if (error) {
              mainWindow.webContents.send('error', error);
            } else {
              mainWindow.webContents.send('performance', result);
              mainWindow.webContents.send('check-error', result); // it can compute with error such as missing parameters   
            }
          });
        }
      }
    } else if (obj.parMetisRadioValue === '2') {
      console.log('\nValues send from UI:');
      console.log(obj);
      console.log('\n');

      if (obj.remoteServerId) {
        const server = db.getServer(obj.remoteServerId);
        console.log(server);
        // TODO: ask password and execute
      } else {
        let params = processReceivedParMetisData(obj);
        executionLib.execParMetis(receivedPath, obj.procsInputParMetis, params, (result, error) => {
          if (error) {
            mainWindow.webContents.send('error', error);
          } else {
            mainWindow.webContents.send('performance', result);
          }
        });
      }
    } else if (process.platform === 'linux' && obj.choiceLibrary === '3') {
      console.log(obj);
      let params = processReceivedChacoData(obj);
      console.log(params);
      executionLib.execChaco(receivedPath, params, (result, error) => {
        if (error) {
          mainWindow.webContents.send('error', error);
        } else {
          mainWindow.webContents.send('performance', result);
        }
      });
    }
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});