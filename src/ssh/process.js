'use strict';

const path = require('path');
const EventEmitter = require('events').EventEmitter;

const SSHFile = require('./SSHFile.js').SSHFile;
const SSHShell = require('./SSHShell.js').SSHShell;

function upload(config, localFile, remoteFile, eventEmitter) {
  const f = new SSHFile(config);
  f.on('ready', () => {
    f.uploadFile(localFile, remoteFile);
  }).on('success', () => {
    f.disconnect();
    eventEmitter.emit('upload-success');
  }).on('error', (event, err) => {
    f.disconnect();
    eventEmitter.emit('error', err);
  }).connect();
}

function executeCommands(config, commands, eventEmitter) {
  const s = new SSHShell(config);
  s.on('ready', () => {
    s.executeCommands(commands);
  }).on('command', (event, command, stdout) => {
    console.log(`Command: ${command}`);
    console.log(`STDOUT: ${stdout}`);
  }).on('success', () => {
    s.disconnect();
    eventEmitter.emit('command-success');
  }).on('error', (event, err) => {
    s.disconnect();
    eventEmitter.emit('error', err);
  }).connect();
}

function download(config, localFile, remoteFile, eventEmitter) {
  const f = new SSHFile(config);
  f.on('ready', () => {
    f.downloadFile(localFile, remoteFile);
  }).on('success', () => {
    f.disconnect();
    eventEmitter.emit('download-success');
  }).on('error', (event, err) => {
    f.disconnect();
    eventEmitter.emit('error', err);
  }).connect();
}

// TODO: create notifications
function process(server, file, password, library, nparts) {
  const eventEmitter = new EventEmitter();
  const config = {
    'host': server.host,
    'username': server.username,
    'password': password,
    'port': server.port,
    'tryKeyboard': true,
    'readyTimeout': 10000,
  };
  const basename = path.basename(file);
  const inputFile = server.defaultPath + '/' + basename;
  let outputFile = server.defaultPath + '/' + basename + '.part';
  const resultFile = file + '.part.' + nparts.toString();
  let commands = null;
  if (library === 'parmetis') {
    commands = [
      'module load parmetis',
      'module load icc',
      'module load impi',
      'mpirun -np 4 parmetis 1 ' + inputFile + ' ' + nparts,
    ];
  } else if (library === 'mpmetis') {
    commands = [
      'module load metis',
      'mpmetis ' + inputFile + ' ' + nparts,
    ];
    outputFile += '.' + nparts.toString();
  } else {
    commands = [
      'module load metis',
      'gpmetis ' + inputFile + ' ' + nparts,
    ];
    outputFile += '.' + nparts.toString();
  }

  console.log(`basename : ${basename}`);
  console.log(`inputFile : ${inputFile}`);
  console.log(`outputFile : ${outputFile}`);
  console.log(`resultFile : ${resultFile}`);
  console.log(commands);

  eventEmitter.on('error', (err) => {
    console.log(err);
  }).on('upload-success', () => {
    setTimeout(() => {
      executeCommands(config, commands, eventEmitter);
    }, 2000);
  }).on ('command-success', () => {
    setTimeout(() => {
      download(config, resultFile, outputFile, eventEmitter);
    }, 2000);
  }).on('download-success', () => {
    console.log('UPLOAD - COMMAND - DOWNLOAD : SUCCESS!!!!');
  });

  upload(config, file, inputFile, eventEmitter);
}

module.exports.process = process;
