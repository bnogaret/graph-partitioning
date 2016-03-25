'use strict';

const path = require('path');
const EventEmitter = require('events').EventEmitter;

const SSHFile = require('./SSHFile.js').SSHFile;
const SSHShell = require('./SSHShell.js').SSHShell;
const getStringFromOptions = require('../executionLib.js').getStringFromOptions;
const getStringFromOptionsWithKeys = require('../executionLib.js').getStringFromOptionsWithKeys;

function hasError(text) {
  const errorRegex = new RegExp('[Ee]rror');
  const fileErrorRegex = new RegExp('input file does not specify the number of vertices and edges');
  return errorRegex.test(text) || fileErrorRegex.test(text);
}

function upload(config, localFile, remoteFile, internalEmitter) {
  const f = new SSHFile(config);
  f.on('ready', () => {
    f.uploadFile(localFile, remoteFile);
    internalEmitter.emit('upload-start');
  }).on('step', (totalTransferred, chunk, total) => {
    internalEmitter.emit('upload-step', totalTransferred, total);
  }).on('success', () => {
    f.disconnect();
    internalEmitter.emit('upload-end');
  }).on('error', (err) => {
    f.disconnect();
    internalEmitter.emit('error', err);
  }).connect();
}

function executeCommands(config, commands, internalEmitter) {
  const s = new SSHShell(config);
  s.on('ready', () => {
    s.executeCommands(commands);
    internalEmitter.emit('commands-start');
  }).on('command', (command, stdout) => {
    if (hasError(stdout)) {
      const message = `Error when executing ${command}: ${stdout}`;
      internalEmitter.emit('error', new Error(message));
      s.disconnect();
    } else {
      if (command) {
        internalEmitter.emit('command-result', command, stdout);
      }
      s.processNextCommand();
    }
  }).on('success', () => {
    s.disconnect();
    internalEmitter.emit('commands-end');
  }).on('error', (err) => {
    s.disconnect();
    internalEmitter.emit('error', err);
  }).connect();
}

function download(config, localFile, remoteFile, internalEmitter) {
  const f = new SSHFile(config);
  f.on('ready', () => {
    f.downloadFile(localFile, remoteFile);
    internalEmitter.emit('download-start');
  }).on('step', (totalTransferred, chunk, total) => {
    internalEmitter.emit('download-step', totalTransferred, total);
  }).on('success', () => {
    f.disconnect();
    internalEmitter.emit('download-end');
  }).on('error', (err) => {
    f.disconnect();
    internalEmitter.emit('error', err);
  }).connect();
}

function getCommands(library, file, nbPartitions, options) {
  let commands = null;
  let parameters = null;
  if (library === 'parmetis') {
    parameters = getStringFromOptions(options);
    commands = [
      'module load parmetis',
      'module load icc',
      'module load impi',
      `mpirun -n ${options.nbProcessors} parmetis ${file} 1 ${options.nparts} 2 1.05 1 ${options.seed}`,
    ];
  } else if (library === 'mpmetis') {
    parameters = getStringFromOptionsWithKeys(options);
    commands = [
      'module load metis',
      `mpmetis ${parameters} ${parameters} ${file} ${nbPartitions}`,
    ];
  } else {
    parameters = getStringFromOptionsWithKeys(options);
    commands = [
      'module load metis',
      `gpmetis ${parameters} ${parameters} ${file} ${nbPartitions}`,
    ];
  }
  return commands;
}

/**
* Function that uploads the file in the remote server, executes the library (with the parameters 'options')
* and downloads back the result file in the same directory as the uploaded file.
*
* The parameter eventEmitter will emit:
* - @event eventEmitter#error with one parameter (<Error> err)
* - @event eventEmitter#upload-start with three parameters (<String> host, <String> basename, <String> defaultPath)
* - @event eventEmitter#upload-step with two parameters (<int> totalTransferred, <int> total)
* - @event eventEmitter#upload-end with no parameter
* - @event eventEmitter#commands-start with no parameter
* - @event eventEmitter#command-result with two parameters (<String> command,<String> stdout)
* - @event eventEmitter#commands-end with no parameter
* - @event eventEmitter#download-start with two parameters (<String> fileName, <String> fileDirectory)
* - @event eventEmitter#download-step with two parameters (<int> totalTransferred, <int> total)
* - @event eventEmitter#download-end with one parameter (<String> host)
*
* For the library mpmetis, it only downloads the .npart file.
*
* TODO mpmetis: download all the files
* TODO compress the upload and download file(s).
*
* @param {Object} server
* @param {String} password
* @param {String} file: path to the file
* @param {String} library: either 'mpmetis' (metis for mesh), 'gpmetis' (metis for graph) or 'parmetis'
* @param {int} nparts: number of partitions
* @param {Object} options: options to pass to the library
* @param {EventEmitter} eventEmitter
*/
function process(server, password, file, library, nparts, options, eventEmitter) {
  console.log(server);
  console.log(password);
  console.log(file);
  console.log(library);
  console.log(nparts);

  const internalEmitter = new EventEmitter();
  const config = {
    'host': server.host,
    'username': server.username,
    'password': password,
    'port': server.port,
    'tryKeyboard': true,
    'readyTimeout': 10000,
  };

  const basename = path.basename(file);
  let outputFile = null;
  let resultFile = null;
  if (library === 'mpmetis') {
    outputFile = server.defaultPath + '/' + basename + '.npart.' + nparts;
    resultFile = file + '.npart.' + nparts;
  } else {
    outputFile = server.defaultPath + '/' + basename + '.part.' + nparts;
    resultFile = file + '.part.' + nparts;
  }
  const inputFile = server.defaultPath + '/' + basename;

  const commands = getCommands(library, inputFile, nparts);

  console.log(`basename : ${basename}`);
  console.log(`inputFile : ${inputFile}`);
  console.log(`outputFile : ${outputFile}`);
  console.log(`resultFile : ${resultFile}`);
  console.log(commands);

  internalEmitter.on('error', (err) => {
    eventEmitter.emit('error', err);
  }).on('upload-start', () => {
    console.log('Start Upload');
    eventEmitter.emit('upload-start', config.host, basename, server.defaultPath);
  }).on('upload-step', (totalTransferred, total) => {
    console.log(`Upload: transferred : ${totalTransferred} over ${total}`);
    eventEmitter.emit('upload-step', totalTransferred, total);
  }).on('upload-end', () => {
    setTimeout(() => {
      executeCommands(config, commands, internalEmitter);
    }, 2000);
    eventEmitter.emit('upload-end');
  }).on('commands-start', () => {
    console.log('Command Upload');
    eventEmitter.emit('commands-start');
  }).on('command-result', (command, stdout) => {
    // console.log(`Command: ${command}`);
    // console.log(`STDOUT: ${stdout}`);
    eventEmitter.emit('command-result', stdout);
  }).on ('commands-end', () => {
    setTimeout(() => {
      download(config, resultFile, outputFile, internalEmitter);
    }, 2000);
    eventEmitter.emit('commands-end');
  }).on('download-start', () => {
    console.log('Start download');
    eventEmitter.emit('download-start', path.basename(resultFile), path.dirname(resultFile));
  }).on('download-step', (totalTransferred, total) => {
    console.log(`Download: transferred : ${totalTransferred} over ${total}`);
    eventEmitter.emit('download-step', totalTransferred, total);
  }).on('download-end', () => {
    console.log('UPLOAD - COMMAND - DOWNLOAD : SUCCESS!!!!');
    eventEmitter.emit('download-end', config.host);
  });

  upload(config, file, inputFile, internalEmitter);
}

module.exports.process = process;
