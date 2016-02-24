'use strict';

const os = require('os');
const exec = require('child_process').exec; // Prefer use spawn if big data

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

function execApp(program, file, nPartition, options, callback) {
  let option = getStringFromOptions(options);
  let command = `${program} ${option} ${file} ${nPartition}`;
  console.log(`myExec's command: ${command}`);
  exec(command, (error, stdout, stderr) => {
    console.log(`stderr: ${stderr}`);
    console.log(`stdout: ${stdout.split(os.EOL)}`);
    if (error !== null) {
      callback(error);
    }
  });
}

function execGpMetis(file, nPartition, parameters) {
  /*let options = {
    'ptype': 'rb',
    'ctype': 'rm',
    'niter': 5,
  };*/
  let options = parameters;
  let program = '';
  if (process.platform === 'win32') {
    program = __dirname + '/../native/gpmetis.exe';
  } else if (process.platform === 'linux') {
    program = __dirname + '/../native/gpmetis';
  }
  execApp(program, file, nPartition, options, (error) => {
    if (error) {
      console.log(`${error}`);
    }
  });
}

function execMpMetis(file, nPartition, parameters) {
  let program = '';
  let options = parameters;
  if (process.platform === 'win32') {
    program = __dirname + '/../native/mpmetis.exe';
  } else if (process.platform === 'linux') {
    program = __dirname + '/../native/mpmetis';
  }
  // should in 'execApp' be parameters or null?
  execApp(program, file, nPartition, parameters, (error) => {
    if (error) {
      console.log(`${error}`);
    }
  });
}


function execParMetisApp(program, file, nPartition, options, callback) {
  let option = getStringFromOptions(options);
  let command = `${program} ${file} ${nPartition} ${option}  `;
  console.log(`myExec's command: ${command}`);
  exec(command, (error, stdout, stderr) => {
    console.log(`stderr: ${stderr}`);
    console.log(`stdout: ${stdout.split(os.EOL)}`);
    if (error !== null) {
      callback(error);
    }
  });
}

function execParMetis(file, nPartition, parameters) {
  let program = '';
  let options = parameters;
  if (process.platform === 'win32') {
    program = __dirname + '/../native/parmetis.exe';
  } else if (process.platform === 'linux') {
    program = __dirname + '/../native/parmetis';
  }
  execParMetisApp(program, file, nPartition, options, (error) => {
    if (error) {
      console.log(`${error}`);
    }
  });
}

module.exports.execGpMetis = execGpMetis;
module.exports.execMpMetis = execMpMetis;
module.exports.execParMetis = execParMetis;