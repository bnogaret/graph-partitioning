'use strict';

const localDatabase = require('../db/localDatabase.js').localDatabase;
const ipcRenderer = require('electron').ipcRenderer;

const metisOption = document.querySelector('#metisOption');
const parMetisOption = document.querySelector('#parMetisOption');

const numberOfPartitions = document.querySelector('#numberOfPartitions');
const visResultsCheckBox = document.querySelector('#visResultsCheckBox');
const buttonClose = document.getElementById('button-close');
const buttonOk = document.querySelector('#button-ok');

const metisForm = document.getElementById('metisForm');
const ctype = document.getElementById('ctype');
const maxImbalance = document.getElementById('maxImbalance');
const niter = document.getElementById('niter');
const iptype = document.getElementById('iptype');
const objtype = document.getElementById('objtype');
const iptypeElement = document.getElementById('iptypeElement');
const ptype = document.getElementById('ptype');
const objtypeElement = document.getElementById('objtypeElement');

// par metis form
const parMetisForm = document.getElementById('parMetisForm');
const procsInputParMetis = document.getElementById('procsInputParMetis');
const numberOfPartsParMetis = document.getElementById('numberOfPartsParMetis');
const maxImbalanceParMetis = document.getElementById('maxImbalanceParMetis');


const db = new localDatabase();
const servers = db.getServers();
let selectOption = '';

if (servers) {
  selectOption = '<div class="mdl-selectfield mdl-js-selectfield mdl-selectfield--floating-label" id="remoteServerDiv"> \
                    <select id="remoteServer" class="mdl-selectfield__select"> \
                      <option value=""></option>';

  servers.forEach((i) => {
    selectOption += `<option value="${i.id}">${i.username}@${i.host}</option>`;
  });

  selectOption += '</select> \
                  <label class="mdl-selectfield__label" for="remoteServerDiv"><font size="2">Select a remote server</font></label> \
                </div>';
  metisForm.innerHTML += selectOption;
  parMetisForm.innerHTML += selectOption;
}

buttonClose.addEventListener('click', () => {
  window.close();
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
  };
});

metisOption.addEventListener('click', () => {
  iptypeElement.style.display = 'none';
  objtypeElement.style.display = 'none';
  metisForm.style.display = 'block';
  parMetisForm.style.display = 'none';
});

parMetisOption.addEventListener('click', () => {
  metisForm.style.display = 'none';
  parMetisForm.style.display = 'block';
});

buttonOk.addEventListener('click', () => {
  const remoteServerSelect = document.getElementById('remoteServer');
  if (metisOption.checked === true) {
    let options = {
      // radiobuttons options
      parMetisRadioValue: parMetisOption.checked,
      metisRadioValue: metisOption.checked,
      // values. Sending all values, validation is in main.js before executing lib
      numberOfPartitions: numberOfPartitions.value,
      ctype: ctype.value,
      maxImbalance: maxImbalance.value,
      niter: niter.value,
      ptype: ptype.value,
      iptype: iptype.value,
      objtype: objtype.value,
      // visualization
      visResultsCheckBox: visResultsCheckBox.checked,
      // remote server
      remoteServerId: remoteServerSelect ? remoteServerSelect.value : '',
    };
    ipcRenderer.send('exec-configuration', options);
  } else if (parMetisOption.checked === true) {
    let options = {
      // radiobuttons options
      parMetisRadioValue: parMetisOption.checked,
      metisRadioValue: metisOption.checked,
      // values
      procsInputParMetis: procsInputParMetis.value,
      numberOfPartsParMetis: numberOfPartsParMetis.value,
      maxImbalanceParMetis: maxImbalanceParMetis.value,
      visResultsCheckBox: visResultsCheckBox.checked,
      // remote server
      remoteServerId: remoteServerSelect ? remoteServerSelect.value : '',
    };
    ipcRenderer.send('exec-configuration', options);
  } // TODO other libraries for linux

  window.close();
});
