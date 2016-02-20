'use strict';

const low = require('lowdb');
const storage = require('lowdb/file-sync');

class localDatabase {
  getServers() {
    return this._db(this._table);
  }

  /**
  *
  * @param {string} id: id of the server to find
  * @return {object} an object or undefined
  */
  getServer(id) {
    return this._db(this._table).find({'id': id});
  }

  addServer(server) {
    this._db(this._table).push(server);
  }

  constructor() {
    this._table = 'servers';
    this._db = low('user_db.json', {storage});
  }
}

module.exports.localDatabase = localDatabase;
