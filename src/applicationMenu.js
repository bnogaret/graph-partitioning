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
              createWindow(1000, 700, '/optionsDialog/optionsDialog.html');
              ipcRenderer.send('exe-initialization', file[0], false);
            }
          },
        },
        {
          label: 'New mesh',
          click: () => {
            let file = fileDialog.getFile();
            if (typeof file !== 'undefined') {
              createWindow(1000, 700, '/optionsDialog/optionsDialog.html');
              ipcRenderer.send('exe-initialization', file[0], true);
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
            createWindow(1000, 600, '/server/addServer.html');
          },
        },
        {
          label: 'See servers',
          click: () => {
            createWindow(750, 400, '/server/seeServer.html');
          },
        },
      ],
    },
  ];
  const menu = Menu.buildFromTemplate(templateMenu);
  Menu.setApplicationMenu(menu);
}

module.exports.createApplicationMenu = createApplicationMenu;
