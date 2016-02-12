'use strict';

const remote = require('remote');
// const ipcRenderer = require('electron').ipcRenderer;
const Menu = remote.require('menu');

const BrowserWindow = require('electron').remote.BrowserWindow;

const rendering = require('./rendering');

// const mat = require('../node_modules/material-design-lite/material.min.js');

const executionLib = require('./executionLib');
const fileDialog = require('./fileDialog');

function createApplicationMenu () {
  const templateMenu = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New graph',
          click: () => {
            let file = fileDialog.getFile();
            if (typeof file !== 'undefined') {
              executionLib.execGpMetis(file, 4);
			  rendering.onLoad();
			
            }
          },
        },
        {
          label: 'New mesh',
          click: () => {
            let file = fileDialog.getFile();
            if (typeof file !== 'undefined') {
              executionLib.execMpMetis(file, 4);
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
            const window = new BrowserWindow({
              width: 500,
              height: 500,
            });
            window.setMenu(null);
            window.webContents.openDevTools();
            window.loadURL('file://' + __dirname + '/server/addServer.html');
          },
        },
        {
          label: 'See servers',
          click: () => {
            const window = new BrowserWindow({
              width: 400,
              height: 400,
            });
            window.setMenu(null);
            window.loadURL('file://' + __dirname + '/server/seeServer.html');
          },
        },
      ],
    },
  ];
  const menu = Menu.buildFromTemplate(templateMenu);
  Menu.setApplicationMenu(menu);
}

module.exports.createApplicationMenu = createApplicationMenu;
