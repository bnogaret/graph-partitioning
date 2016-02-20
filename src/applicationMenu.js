'use strict';

const remote = require('remote');
const Menu = remote.require('menu');
const BrowserWindow = require('electron').remote.BrowserWindow;
const ipcRenderer = require('electron').ipcRenderer;

const fileDialog = require('./fileDialog');


function createWindow(width, height, filePath) {
  const window = new BrowserWindow({
    'width': width,
    'height': height,
    'useContentSize': true,
    'alwaysOnTop': true,
    'resizable': true, // TODO change for production
    'center': true,
  });
  window.setMenu(null);
  window.webContents.openDevTools();
  window.loadURL('file://' + __dirname + filePath);
}

function createApplicationMenu() {
  const templateMenu = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New graph',
          click: () => {
            let file = fileDialog.getFile();
            if (typeof file !== 'undefined') {
              createWindow(661, 606, '/optionsDialog/optionsDialog.html');
              ipcRenderer.send('file-path', file);              
              // executionLib.execMpMetis(file, 4);
              
            }
          },
        },
        {
          label: 'New mesh',
          click: () => {
            let file = fileDialog.getFile();
            if (typeof file !== 'undefined') {
               // executionLib.execMpMetis(file, 4);
            }
          },
        },
        {
          type: 'separator',
        },
        {
          label: 'Cut',
          role: 'cut',
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: (item, focusedWindow) => {
            console.log(item);
            if (focusedWindow) {
              focusedWindow.reload();
            }
          },
        },
      ],
    },
    {
      label: 'Server',
      submenu: [
        {
          label: 'New server',
          click: () => {
            createWindow(500, 500, '/server/addServer.html');
          },
        },
        {
          label: 'See servers',
          click: () => {
            createWindow(600, 500, '/server/seeServer.html');
          },
        },
        {
          label: 'Ask for password',
          click: () => {
            createWindow(600, 500, '/server/askPassword.html');
          },
        },
        {
          label: 'Test servers',
          click: () => {
            let file = fileDialog.getFile();
            if (typeof file !== 'undefined') {
              console.debug(`Ask for the password`);

              console.debug(`Upload the file`);

              console.debug(`Execute commands`);

              console.debug(`Download the file`);
            }
          },
        },
      ],
    },
  ];
  const menu = Menu.buildFromTemplate(templateMenu);
  Menu.setApplicationMenu(menu);
}

module.exports.createApplicationMenu = createApplicationMenu;
