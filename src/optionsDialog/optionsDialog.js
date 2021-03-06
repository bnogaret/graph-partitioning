'use strict';

const shell = require('electron').shell;
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

  const container = document.getElementById('remoteServer__container');

  container.innerHTML = selectOption;
}

const metisOption = document.querySelector('#metisOption');
const parMetisOption = document.querySelector('#parMetisOption');
const chacoOption = document.querySelector('#chacoOption');

const remoteServerSelect = document.getElementById('remoteServer');
const remoteServerContainer = document.getElementById('remoteServer__container');
const password = document.getElementById('password');
const passwordElement = document.getElementById('passwordElement');

// Common multiple libraries
const numberOfPartitions = document.querySelector('#input-number_partitions');
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

// parmetis form
const parMetisForm = document.getElementById('parMetisForm');
const procsInputParMetis = document.getElementById('procsInputParMetis');
const maxImbalanceParMetis = document.getElementById('maxImbalanceParMetis');
const parMetisSeed = document.getElementById('parMetisSeed');

// chaco form
const chacoForm = document.getElementById('chaco-form');
const chacoPartitioningMethod = document.getElementById('chaco-select-partitioning_method');
const chacoDivVertices = document.getElementById('chaco-div-vertices');
const chacoInputVertices = document.getElementById('chaco-input-vertices');
const chacoDivEigensolver = document.getElementById('chaco-div-eigensolver');
const chacoSelectEigensolver = document.getElementById('chaco-select-eigensolver');
const chacoDivLocalRefinement = document.getElementById('chaco-div-local_refinement');
const chacoSelectLocalRefinement = document.getElementById('chaco-select-local_refinement');
const chacoPartitioningDimension = document.getElementById('chaco-select-partitioning_dimension');

if (isLinux()) {
  // Display linux-only content (currently chaco-related elements)
  // const div = chacoOption.parentNode;
  // div.style.display = 'inline-block';
  Array.from(document.querySelectorAll('.visible-for-linux')).forEach((element) => {
    element.style.display = 'inline-block';
  });
}

Array.from(document.querySelectorAll('.open-external-url')).forEach((element) => {
  element.addEventListener('click', (event) => {
    shell.openExternal(element.href);
    event.preventDefault();
  });
});

metisOption.addEventListener('click', () => {
  console.log('metisOption');
  metisForm.style.display = 'block';
  parMetisForm.style.display = 'none';
  chacoForm.style.display = 'none';
  remoteServerContainer.style.display = 'block';
});

parMetisOption.addEventListener('click', () => {
  console.log('parMetisOption');
  metisForm.style.display = 'none';
  parMetisForm.style.display = 'block';
  chacoForm.style.display = 'none';
  remoteServerContainer.style.display = 'block';
});

chacoOption.addEventListener('click', () => {
  console.log('chacoOption');
  metisForm.style.display = 'none';
  parMetisForm.style.display = 'none';
  chacoForm.style.display = 'block';
  remoteServerContainer.style.display = 'none';
  remoteServerSelect.selectedIndex = 0;
  passwordElement.style.display = 'none';
});


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

remoteServerSelect.addEventListener('change', () => {
  if (remoteServerSelect.value !== '') {
    console.log('User has chosen a SERVER!');
    passwordElement.style.display = 'block';
  } else {
    passwordElement.style.display = 'none';
    passwordElement.value = '';
  }
});

// Handle display / hide of chaco options
chacoPartitioningMethod.addEventListener('change', () => {
  switch(chacoPartitioningMethod.options[chacoPartitioningMethod.selectedIndex].value) {
    case '1':
      chacoDivVertices.style.display = 'block';
      chacoDivEigensolver.style.display = 'none';
      chacoDivLocalRefinement.style.display = 'none';
      break;
    case '2':
      chacoDivVertices.style.display = 'block';
      chacoDivEigensolver.style.display = 'block';
      chacoDivLocalRefinement.style.display = 'block';
      break;
    case '4':
    case '5':
    case '6':
      chacoDivVertices.style.display = 'none';
      chacoDivEigensolver.style.display = 'none';
      chacoDivLocalRefinement.style.display = 'block';
      break;
    default:
      chacoDivVertices.style.display = 'none';
      chacoDivEigensolver.style.display = 'none';
      chacoDivLocalRefinement.style.display = 'none';
      break;
  }
});

buttonClose.addEventListener('click', () => {
  window.close();
});

buttonOk.addEventListener('click', () => {
  const choiceLibrary = document.querySelector('input[name="choice-library"]:checked');
  if (metisOption.checked === true) {
    let options = {
      // choice of the library
      choiceLibrary: choiceLibrary.value,
      // Number of partitions
      numberOfPartitions: numberOfPartitions.value,
      // Metis values. Sending all values, validation is in main.js before executing lib
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
      password: password.value,
    };
    ipcRenderer.send('exec-configuration', options);
  } else if (parMetisOption.checked === true) {
    let options = {
      // choice of the library
      choiceLibrary: choiceLibrary.value,
      // Number of partitions
      numberOfPartitions: numberOfPartitions.value,
      // Parmetis values
      procsInputParMetis: procsInputParMetis.value,
      // numberOfPartsParMetis: numberOfPartsParMetis.value,
      maxImbalanceParMetis: maxImbalanceParMetis.value,
      seed: parMetisSeed.value,
      // visualization
      visResultsCheckBox: visResultsCheckBox.checked,
      // remote server
      remoteServerId: remoteServerSelect ? remoteServerSelect.value : '',
      password: password.value,
    };
    ipcRenderer.send('exec-configuration', options);
  } else if (chacoOption.checked) {
    let options = {
      // choice of the library
      choiceLibrary: choiceLibrary.value,
      // Number of partitions
      numberOfPartitions: numberOfPartitions.value,
      // Chaco values
      partitioningMethod: chacoPartitioningMethod.value,
      vertices: chacoInputVertices.value,
      eigensolver: chacoSelectEigensolver.value,
      localRefinement: chacoSelectLocalRefinement.value,
      partitioningDimension: chacoPartitioningDimension.value,
      // visualization
      visResultsCheckBox: visResultsCheckBox.checked,
    };
    console.log(options);
    ipcRenderer.send('exec-configuration', options);
  }


  window.close();
});

// console.log(document.querySelectorAll('input[name="choice-library"]'));
// console.log(document.querySelector('input[name="choice-library"]:checked').value);
// console.log(navigator.appVersion);
// console.log(isLinux());
