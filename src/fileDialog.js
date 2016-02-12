'use strict';

const dialog = require('remote').require('electron').dialog;

function getFile() {
  return dialog.showOpenDialog({
    properties: ['openFile'],
  });
}

module.exports.getFile = getFile;
