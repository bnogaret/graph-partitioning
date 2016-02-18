'use strict';

const ipcRenderer = require('electron').ipcRenderer;
const metisOption = document.querySelector('#metisOption');
const parMetisOption = document.querySelector('#parMetisOption');
const remoteMetisOption = document.querySelector('#remoteMetisOption');
const procsInput = document.querySelector('#procsInput');
const visResultsCheckBox = document.querySelector('#visResultsCheckBox');
const buttonClose = document.getElementById('button-close');
const buttonOk = document.querySelector('#button-ok');


const metisForm = document.getElementById('metisForm');
const procsInputElement = document.querySelector('#procsInputElement');
const ctypeElement = document.getElementById('ctypeElement');
const maxImbalanceElement = document.getElementById('maxImbalanceElement');
const ptypeElement = document.getElementById('ptypeElement');
const iptypeElement = document.getElementById('iptypeElement');
const ptype = document.getElementById('ptype');
const objtypeElement = document.getElementById('objtypeElement');


buttonClose.addEventListener('click', () => {
  window.close();
});

metisOption.addEventListener('click', () => {
  iptypeElement.style.display = 'none';
  objtypeElement.style.display = 'none';
  metisForm.style.display = 'block';
});

// handle case when iptype/objtype should be hidden/visible in case of ptype value
ptype.addEventListener('click', () => {
  ptype.onchange = function () {
    if (this.options[this.selectedIndex].value === 'rb') {
      iptypeElement.style.display = 'block';
      objtypeElement.style.display = 'none';
    } else if (this.options[this.selectedIndex].value === 'kway') {
      iptypeElement.style.display = 'none';
      objtypeElement.style.display = 'block';
      this.options.value = '';
    }
  }
});

parMetisOption.addEventListener('click', () => {
  metisForm.style.display = 'none';
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