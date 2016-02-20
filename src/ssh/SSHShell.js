'use strict';

const SSHConnection = require('./SSHConnection.js').SSHConnection;

class SSHShell extends SSHConnection {
  processNextCommand() {
    if (this._commands.length > 0) {
      this._command = this._commands.shift();
      console.log(`Command : ${this._command}`);
      this._stream.write(`${this._command}\n`);
      this.emit('command', this._command, this._response);
    } else {
      this._stream.close();
      this.emit('success');
    }
  }

  processData (data) {
    // Get rid of all the non-ascii characters
    const temp = data.replace(/[^\x00-\x7F]/g, '');
    if (this._standardPrompt.test(temp)) {
      console.log(`STDOUT: ${this._response}`);
      this.processNextCommand();
      this._response = '';
    } else {
      this._response += temp;
    }
  }

  createShell () {
    this._conn.shell((err, stream) => {
      if (err) {
        this.emit('error', err);
      }
      if (stream) {
        this._stream = stream;
        this._stream.on('end', () => {
          console.log('Stream :: end');
        }).on('close', () => {
          console.log('Stream :: close');
        }).on('readable', () => {
          let data = '';
          while ((data = this._stream.read())) {
            this.processData(data.toString());
          }
        }).stderr.on('data', (data) => {
          console.log(`STDERR: + ${data}`);
          this.emit('error', new Error(data));
        });
      }
    });
  }

  /**
  * Execute the list of commands included in the commands parameter. They are executed sequentially and in order.
  * Every time a command has been executed, it emits 'command' (<string> command, <string> output).
  * When all the commands have been executed, it emits 'success' (). SSHShell is now ready to execute new commands.
  * @param {Array <string>} commands: list of commands.
  */
  executeCommands(commands) {
    if (this._isConnected) {
      console.log(commands);
      this._commands = commands;
      this.createShell();
    } else {
      this.emit('error', new Error ('Not connected, cannot execute the commands.'));
    }
  }

  constructor (config) {
    super(config);

    this._commands = [];
    this._stream = null;
    this._command = '';
    this._standardPrompt = new RegExp('[>$%#]\\s$');
    this._response = '';
  }
}

module.exports.SSHShell = SSHShell;
