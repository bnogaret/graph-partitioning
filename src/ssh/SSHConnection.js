'use strict';

const Client = require('ssh2').Client;
const EventEmitter = require('events').EventEmitter;

/**
* Connect to the remote server (method connect), work and disconnect (method disconnect).
* Events:
* - 'ready' () : when the connection has been established and is ready to work.
* - 'error' (<Error> err) : in case of error.
* - 'end' () : when the connection end
* @see SSHFile and @see SSHShell to see examples of implementation of working functions.
*/
class SSHConnection extends EventEmitter {
  /**
  * Disconnect from the server
  */
  disconnect() {
    this._conn.end();
  }

  /**
  * Connect to the server
  */
  connect() {
    this._conn.on('ready', () => {
      console.log('Client :: ready');
      this._isConnected = true;
      this.emit('ready');
    }).on('keyboard-interactive', (name, instructions, instructionsLang, prompts, finish) => {
      console.log('Client :: keyboard-interactive');
      finish([this._config.password]);
    }).on('error', (err) => {
      // console.log(`Client :: Error\n ${err.message()}`);
      this.emit('error', err);
    }).on('close', hadError => {
      this._isConnected = false;
      if (hadError) {
        // console.log('Client :: Close due to an error');
        this.emit('error', new Error('SSH Connection close due to an expected error.'));
      } else {
        console.log('Client :: Close');
      }
    }).on('end', () => {
      this._isConnected = false;
      console.log('Client :: End');
      this.emit('end');
    })
    .connect(this._config);
  }

  /**
  * Must must contain:
  * - {string} host
  * - {int} port
  * - {string} username
  * - {string} password
  * - {boolean} tryKeyboard
  * @param {object} config: configuration object.
  */
  constructor (config) {
    super();
    this._config = config;
    this._conn = new Client();
    this._isConnected = false;
  }
}

module.exports.SSHConnection = SSHConnection;
