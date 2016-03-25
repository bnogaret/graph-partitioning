'use strict';

const os = require('os');
const exec = require('child_process').exec; // Prefer use spawn if big data
const path = require('path');

const getStringFromOptions = require('./executionLib.js').getStringFromOptions;
const getStringFromOptionsWithKeys = require('./executionLib.js').getStringFromOptionsWithKeys;

const PROGRAM_DIRECTORY = __dirname + '/../native/';

function execApp(command, callback) {
  console.log(command);
  exec(command, (error, stdout, stderr) => {
    console.log(`stderr: ${stderr}`);
    console.log(error);
    console.log(`stdout: ${stdout.split(os.EOL)}`);
    callback(stdout, error, stderr);
  });
}

function execGpMetis(file, nbPartitions, parameters, callback) {
  let program = PROGRAM_DIRECTORY + 'gpmetis';
  if (process.platform === 'win32') {
    program += '.exe';
  }

  const option = getStringFromOptionsWithKeys(parameters);
  const command = `${program} ${option} ${file} ${nbPartitions}`;
  execApp(command, (result, error, stderr) => {
    callback(result, error, stderr, 'gpmetis');
  });
}

function execMpMetis(file, nbPartitions, parameters, callback) {
  let program = PROGRAM_DIRECTORY + 'mpmetis';
  if (process.platform === 'win32') {
    program += '.exe';
  }

  const option = getStringFromOptionsWithKeys(parameters);
  const command = `${program} ${option} ${file} ${nbPartitions}`;

  execApp(command, (result, error, stderr) => {
    callback(result, error, stderr, 'mpmetis');
  });
}

function execParMetis(file, parameters, callback) {
  let command = '';
  let program = PROGRAM_DIRECTORY + 'parmetis';
  if (process.platform === 'win32') {
    program += '.exe';
    command = `mpiexec -n ${parameters.nbProcessors} ${program} ${file} ${parameters.nparts} ${parameters.maxub} ${parameters.seed}`;
  } else {
    command = `mpiexec -n ${parameters.nbProcessors} ${program} ${file} 1 ${parameters.nparts} 2 1.05 3 ${parameters.seed}`;
  }

  console.log(command);

  execApp(command, (result, error, stderr) => {
    callback(result, error, stderr, 'parmetis');
  });
}

function execChaco(file, parameters, callback) {
  const output = path.dirname(file) + '/' + path.basename(file) + '.part.' + parameters.numberOfPartitions;
  const program = PROGRAM_DIRECTORY + 'chaco';
  const option = getStringFromOptions(parameters);
  const command = `echo '${file} ${output} ${option} n' | ${program}`;

  console.log(command);

  execApp(command, (result, error, stderr) => {
    callback(result, error, stderr, 'chaco');
  });
}

module.exports.execGpMetis = execGpMetis;
module.exports.execMpMetis = execMpMetis;
module.exports.execParMetis = execParMetis;
module.exports.execChaco = execChaco;
