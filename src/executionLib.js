'use strict';
const os = require('os');
const exec = require('child_process').exec; // Prefer use spawn if big data
const path = require('path');

const PROGRAM_DIRECTORY = __dirname + '/../native/';

/**
 * Transform the keys /value of the object options into a string with the format: -key=value -key=value.
 * If options is null or not an object, it returns an empty string.
 * @param {Object} options
 * @return {string}
 */
function getStringFromOptionsWithKeys(options) {
  let option = '';
  if (options !== null && typeof options === 'object') {
    for (let key in options) {
      if (options[key]) {
        option += ` -${key}=${options[key]}`;
      }
    }
  }
  return option.trim();
}

function getStringFromOptions(options) {
  let option = '';
  if (options !== null && typeof options === 'object') {
    for (let key in options) {
      if (options[key]) {
        option += ` ${options[key]}`;
      }
    }
  }
  return option.trim();
}

function execApp(command, callback) {
  exec(command, (error, stdout, stderr) => {
    console.log(`stderr: ${stderr}`);
    console.log(error);
    console.log(`stdout: ${stdout.split(os.EOL)}`);
    callback(stdout, error);
  });
}

function execGpMetis(file, nbPartitions, parameters, callback) {
  let program = PROGRAM_DIRECTORY + 'gpmetis';
  if (process.platform === 'win32') {
    program += '.exe';
  }

  const option = getStringFromOptionsWithKeys(parameters);
  const command = `${program} ${option} ${file} ${nbPartitions}`;

  execApp(command, (result, error) => {
    callback(result, error);
  });
}

<<<<<<< HEAD
function execMpMetis(file, nPartition, parameters, gtype, callback) {
  let program = '';
=======
function execMpMetis(file, nbPartitions, parameters, callback) {
  let program = PROGRAM_DIRECTORY + 'mpmetis';
>>>>>>> d9b4db82381f65b8735f66104850a3297eea43cd
  if (process.platform === 'win32') {
    program += '.exe';
  }

  const option = getStringFromOptionsWithKeys(parameters);
  const command = `${program} ${option} ${file} ${nbPartitions}`;

  execApp(command, (result, error) => {
    callback(result, error);
  });
}

function execParMetis(file, nbProcessors, parameters, callback) {
  let program = PROGRAM_DIRECTORY + 'parmetis';
  if (process.platform === 'win32') {
    program += '.exe';
  }

  const option = getStringFromOptions(parameters);
  const command = `mpiexec -n ${nbProcessors} ${program} ${file} ${option}`;

  execApp(command, (result, error) => {
    callback(result, error);
  });
}

function execChaco(file, parameters, callback) {
  const output = path.dirname(file) + '/' + path.basename(file) + '.part.' + parameters.numberOfPartitions;
  const program = PROGRAM_DIRECTORY + 'chaco';
  const option = getStringFromOptions(parameters);
  const command = `echo '${file} ${output} ${option} n' | ${program}`;

  console.log(command);

  execApp(command, (result, error) => {
    callback(result, error);
  });
}

module.exports.execGpMetis = execGpMetis;
module.exports.execMpMetis = execMpMetis;
module.exports.execParMetis = execParMetis;
module.exports.execChaco = execChaco;
