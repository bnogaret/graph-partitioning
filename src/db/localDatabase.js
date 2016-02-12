'use strict';

const low = require('lowdb');
const storage = require('lowdb/file-sync');

class localDatabase {
  getServers() {
    return this._db(this._table);
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
