'use strict';
const os = require('os');
const exec = require('child_process').exec; // Prefer use spawn if big data
const ipcMain = require('electron').ipcMain; // Send library
const path = require('path');

/**
 * Transform the keys /value of the object options into a string with the format: -key=value -key=value.
 * If options is null or not an object, it returns an empty string.
 * @param {Object} options
 * @return {string}
 */
function getStringFromOptions(options) {
  let option = '';
  if (options !== null && typeof options === 'object') {
    for (let key in options) {
      if (options[key]) {
        option += ` -${key}=${options[key]}`;
      }
    }
    /*
    Object.keys(options).forEach((key) => {
      option += ` -${key}=${options[key]}`;
    });
    */
  }
  return option.trim();
}

function getStringFromParMetisOptions(options) {
  let option = '';
  if (options !== null && typeof options === 'object') {
    for (let key in options) {
      if (options[key]) {
        option += ` ${options[key]}`; // with this parMetis works!
      }
    }

  }
  return option.trim();
}

function execApp(program, file, nPartition, options, callback) {
  let nPart = nPartition;
  let option = getStringFromOptions(options);
  let command = `${program} ${option} ${file} ${nPart}`;
  console.log(`myExec's command: ${command}`);
  exec(command, (error, stdout, stderr) => {
    console.log(`stderr: ${stderr}`);
    console.log(`stdout: ${stdout.split(os.EOL)}`);
    callback(stdout, error);
  });  
}

function execGpMetis(file, nPartition, parameters, callback) {
  let nPart = nPartition;
  let options = parameters;
  let program = '';
  if (process.platform === 'win32') {
    program = __dirname + '/../native/gpmetis.exe';
  } else if (process.platform === 'linux') {
    program = __dirname + '/../native/gpmetis';
  }
  execApp(program, file, nPartition, options, (result, error) => {
    console.log(`${error}`);
    callback(result, error);
  });
}

function execMpMetis(file, nPartition, parameters, callback) {
  let program = '';
  let options = parameters;
  if (process.platform === 'win32') {
    program = __dirname + '/../native/mpmetis.exe';
  } else if (process.platform === 'linux') {
    program = __dirname + '/../native/mpmetis';
  }
  // should in 'execApp' be parameters or null?
  execApp(program, file, nPartition, parameters, (result, error) => {
    if (error) {
      console.log(`${error}`);
    }
  callback(result, error);
  });
}

function execParMetisApp(program, file, nOfProcessors, options, callback) {
  let option = getStringFromParMetisOptions(options);
  let command = `mpiexec -n ${nOfProcessors} ${program} ${file} ${option}  `;
  console.log(`myExec's command: ${command}`);
  exec(command, (error, stdout, stderr) => {
    console.log(`stderr: ${stderr}`);
    console.log(`stdout: ${stdout.split(os.EOL)}`);
    if (error !== null) {
      callback(error);
    }
  });
}

function execParMetis(file, nOfProcessors, parameters) {
  let noproc = nOfProcessors;
  let program = '';
  let options = parameters;
  if (process.platform === 'win32') {
    program = __dirname + '/../native/parmetis.exe';
  } else if (process.platform === 'linux') {
    program = __dirname + '/../native/parmetis';
  }
  execParMetisApp(program, file, noproc, options, (error) => {
    if (error) {
      console.log(`${error}`);
    }
  });
}

function execChaco(file, nPartition) {
  let output = path.dirname(file) + '/' + path.basename(file) + '.npart.' + nPartition;
  let command = `echo '${file} ${output} 1 1000 2 1 n' | ./chaco`;
  exec(command, (error, stdout, stderr) => {
    console.log(`stderr: ${stderr}`);
    console.log(`stdout: ${stdout.split(os.EOL)}`);
    if (error) {
      console.log(`${error}`);
    }
  });
}

module.exports.execGpMetis = execGpMetis;
module.exports.execMpMetis = execMpMetis;
module.exports.execParMetis = execParMetis;
module.exports.execChaco = execChaco;
