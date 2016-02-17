'use strict';

const ipcRenderer = require('electron').ipcRenderer;
const metisOption = document.querySelector('#metisOption');
const parMetisOption = document.querySelector('#parMetisOption');
const remoteMetisOption = document.querySelector('#remoteMetisOption');
const procsInput = document.querySelector('#procsInput');
const visResultsCheckBox = document.querySelector('#visResultsCheckBox');
const buttonClose = document.getElementById('button-close');
const buttonOk = document.querySelector('#button-ok');

const procsInputElement = document.querySelector('#procsInputElement');
const ctypeElement = document.getElementById('ctypeElement');
const metisForm = document.getElementById('metisForm');


buttonClose.addEventListener('click', () => {
  window.close();
});

metisOption.addEventListener('click', () => {
  console.log('METIS radio button is clicked now');
  metisForm.style.display = 'none';

});

parMetisOption.addEventListener('click', () => {
  console.log('parMETIS radio button is clicked now');
  metisForm.style.display = 'block';
});

remoteMetisOption.addEventListener('click', () => {
  console.log('remoteMETIS radio button is clicked now');
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