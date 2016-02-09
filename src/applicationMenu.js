'use strict';

const electron = require('electron');
const Menu = electron.Menu;

const fileDialog = require('./fileDialog');

function createApplicationMenu () {
  const templateMenu = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New graph',
          click: function() {
            let file = fileDialog.getFile();
            if (typeof file !== 'undefined') {
              console.log('New graph');
            }
          },
        },
        {
          label: 'New mesh',
          click: function() {
            let file = fileDialog.getFile();
            if (typeof file !== 'undefined') {
              console.log('New mesh');
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
          click: function(item, focusedWindow) {
            console.log(item);
            if (focusedWindow) {
              focusedWindow.reload();
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
