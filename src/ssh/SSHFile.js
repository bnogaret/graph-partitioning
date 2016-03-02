'use strict';

const SSHConnection = require('./SSHConnection.js').SSHConnection;

// TODO Add a timeout for each command?
class SSHFile extends SSHConnection {
  /**
  * Download the file from the remotePath to the localPath.
  * When the upload has successfully finished, it emits the event 'success'.
  * During the upload, the SSHFile emit the event 'step' with three parameters
  * (<int> totalTransferred, <int> chunk, <int> total) every time a part of a file was transferred.
  * @param {string} localPath
  * @param {string} remotePath
  */
  downloadFile(localPath, remotePath) {
    if (this._isConnected) {
      this._conn.sftp((err, stream) => {
        if (err) {
          this.emit(err);
        }
        if (stream) {
          // console.log(stream);
          stream.fastGet(remotePath, localPath, {
            step: (totalTransferred, chunk, total) => {
              this.emit('step', totalTransferred, chunk, total);
            },
          }, (error) => {
            if (error) {
              this.emit('error', error);
            } else {
              this.emit('success');
            }
          });
        } else {
          this.emit('error', new Error('Empty stream: can\'t download the file.'));
        }
      });
    } else {
      this.emit('error', new Error ('Not connected, cannot dowload file.'));
    }
  }

  /**
  * Upload the file from the localPath to the remotePath (server).
  * When the upload has successfully finished, it emits the event 'success'.
  * During the upload, the SSHFile emit the event 'step' with three parameters
  * (<int> totalTransferred, <int> chunk, <int> total) every time a part of a file was transferred.
  * @param {string} localPath
  * @param {string} remotePath
  * @see https://newspaint.wordpress.com/2013/03/26/how-to-upload-a-file-over-ssh-using-node-js/
  * @see http://jxcore.com/how-to-transfer-files-over-ssh-by-using-node/
  * @see https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md
  */
  uploadFile(localPath, remotePath) {
    if (this._isConnected) {
      this._conn.sftp((err, stream) => {
        if (err) {
          this.emit(err);
        }
        if (stream) {
          // console.log(stream);
          stream.fastPut(localPath, remotePath, {
            step: (totalTransferred, chunk, total) => {
              this.emit('step', totalTransferred, chunk, total);
            },
          }, (error) => {
            if (error) {
              this.emit('error', error);
            } else {
              this.emit('success');
            }
          });
        } else {
          this.emit('error', new Error('Empty stream: can\'t upload the file.'));
        }
      });
    } else {
      this.emit('error', new Error ('Not connected, cannot upload file.'));
    }
  }

  constructor (config) {
    super(config);
  }
}

module.exports.SSHFile = SSHFile;
