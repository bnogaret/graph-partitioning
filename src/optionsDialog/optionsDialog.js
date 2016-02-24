'use strict';

const ipcRenderer = require('electron').ipcRenderer;

const localDatabase = require('../db/localDatabase.js').localDatabase;

function isLinux() {
  return (navigator.appVersion.indexOf('Linux') !== -1);
}

const db = new localDatabase();
const servers = db.getServers();
let selectOption = '';

// Add a select field to the metis and parmetis option to select a remote server (if there is at least one existing server)
if (servers) {
  selectOption = '<div class="mdl-selectfield mdl-js-selectfield mdl-selectfield--floating-label" id="remoteServerDiv"> \
                    <select id="remoteServer" class="mdl-selectfield__select"> \
                      <option value=""></option>';

  servers.forEach((i) => {
    selectOption += `<option value="${i.id}">${i.username}@${i.host}</option>`;
  });

  selectOption += '</select> \
                  <label class="mdl-selectfield__label" for="remoteServer"><font size="2">Select a remote server</font></label> \
                </div>';
  console.log(selectOption);

  const metisForm = document.getElementById('metisForm');
  const parMetisForm = document.getElementById('parMetisForm');

  metisForm.innerHTML += selectOption;
  parMetisForm.innerHTML += selectOption;
}

const metisOption = document.querySelector('#metisOption');
const parMetisOption = document.querySelector('#parMetisOption');

// Common multiple libraries
const numberOfPartitions = document.querySelector('#numberOfPartitions');
const visResultsCheckBox = document.querySelector('#visResultsCheckBox');
const buttonClose = document.getElementById('button-close');
const buttonOk = document.querySelector('#button-ok');

// Metis form
const metisForm = document.getElementById('metisForm');
const ctype = document.getElementById('ctype');
const maxImbalance = document.getElementById('maxImbalance');
const niter = document.getElementById('niter');
const iptype = document.getElementById('iptype');
const objtype = document.getElementById('objtype');
const iptypeElement = document.getElementById('iptypeElement');
const ptype = document.getElementById('ptype');
const objtypeElement = document.getElementById('objtypeElement');
const metisSeed = document.getElementById('metisSeed');
const metisSeedElement = document.getElementById('metisSeedElement');

// par metis form
const parMetisForm = document.getElementById('parMetisForm');
const procsInputParMetis = document.getElementById('procsInputParMetis');
const numberOfPartsParMetis = document.getElementById('numberOfPartsParMetis');
const maxImbalanceParMetis = document.getElementById('maxImbalanceParMetis');

// handle case when iptype/objtype should be hidden/visible in case of ptype value
ptype.addEventListener('change', () => {
  console.log('ptype');
  if (ptype.options[ptype.selectedIndex].value === 'rb') {
    iptypeElement.style.display = 'block';
    objtypeElement.style.display = 'none';
  } else if (ptype.options[ptype.selectedIndex].value === 'kway') {
    iptypeElement.style.display = 'none';
    objtypeElement.style.display = 'block';
    // ptype.options.value = '';
  } else {
    iptypeElement.style.display = 'none';
    objtypeElement.style.display = 'none';
  }
});

metisOption.addEventListener('click', () => {
  console.log('metisOption');
  iptypeElement.style.display = 'none';
  objtypeElement.style.display = 'none';
  metisForm.style.display = 'block';
  parMetisForm.style.display = 'none';
});

parMetisOption.addEventListener('click', () => {
  console.log('parMetisOption');
  metisForm.style.display = 'none';
  parMetisForm.style.display = 'block';
});

buttonClose.addEventListener('click', () => {
  window.close();
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
      seed: metisSeed.value,
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

console.log(navigator.appVersion);
console.log(isLinux());