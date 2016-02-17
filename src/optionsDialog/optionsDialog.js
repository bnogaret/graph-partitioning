'use strict';

const ipcRenderer = require('electron').ipcRenderer;
const metisOption = document.querySelector('#metisOption');
const parMetisOption = document.querySelector('#parMetisOption');
const procsInput = document.querySelector('#procsInput');
const visResultsCheckBox = document.querySelector('#visResultsCheckBox');
const buttonClose = document.getElementById('button-close');
const buttonOk = document.querySelector('#button-ok');


buttonClose.addEventListener('click', () => {
  window.close();
});

buttonOk.addEventListener('click', () => {
  let options = {
    numberOfProcessors: procsInput.value,
    parMetisRadioValue: parMetisOption.checked,
    metisRadioValue: metisOption.checked,
    visResultsCheckBox: visResultsCheckBox.checked
  };

  ipcRenderer.send('exec-configuration', options);
  window.close();
});
