'use strict';

var numberOfProcessors = 0;
var isMetis = true;

const ipcRenderer = require('electron').ipcRenderer;
const metisOption = document.querySelector('#metisOption');
const parMetisOption = document.querySelector('#parMetisOption');
const procsInput = document.querySelector('#procsInput');

const buttonClose = document.querySelector('#button-close');
const buttonOk = document.querySelector('#button-ok');

if (buttonClose) {
  buttonClose.addEventListener('click', () => {
    console.log('DEBUG: button close clicked!!');
    //window.visibility = false;
    window.close();
  });
}


if (buttonOk) {
  buttonOk.addEventListener('click', () => {
    console.log('DEBUG: button OK clicked!!');
    numberOfProcessors = procsInput.value;
    if (metisOption.value == true)
      isMetis = true;
    else
      isMetis = false; // use parMetis library

    window.close();

  });
}


function getIsMetis() {
  return isMetis;
}

function getNumberOfProcesors() {
  return numberOfProcessors;
}

module.exports.getIsMetis = getIsMetis;
module.exports.getNumberOfProcesors = getNumberOfProcesors;