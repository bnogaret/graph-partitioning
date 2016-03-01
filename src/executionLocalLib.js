'use strict';

const os = require('os');
const exec = require('child_process').exec; // Prefer use spawn if big data
const path = require('path');

const getStringFromOptions = require('./executionLib.js').getStringFromOptions;
const getStringFromOptionsWithKeys = require('./executionLib.js').getStringFromOptionsWithKeys;

const PROGRAM_DIRECTORY = __dirname + '/../native/';

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

function execMpMetis(file, nbPartitions, parameters, callback) {
  let program = PROGRAM_DIRECTORY + 'mpmetis';
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
