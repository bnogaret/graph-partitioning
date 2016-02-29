'use strict';

const low = require('lowdb');
const storage = require('lowdb/file-async');


const db = low('user_db.json');

class localDatabase {
    constructor() {
    this._table = 'servers';
    this._db = low('user_db.json', {storage});    
    
      
  }
  
  addServer(server) {
    this._db(this._table).push(server);
  }
  
  getServers() {
    return this._db(this._table);
  }

  /**
  *
  * @param {string} id: id of the server to find
  * @return {object} an object or undefined
  */
  getServer(ide) {
    // 926909410050047
    var dupa  =  ide;
    console.log('localDatabase.js -> received id: '+ dupa);
    console.log('localDatabase.js -> getServer(id): '+ JSON.stringify(this._db(this._table).find({id: dupa})));
    console.log('localDatabase.js -> getServer(id): '+ this._db('servers').find({id: dupa}));
    
    console.log('localDatabase.js -> getServer(): '+ JSON.stringify(this._db(this._table).find({id: 926909410050047})));

    //return this._db(this._table).find({'id': id});
    
  }




}

module.exports.localDatabase = localDatabase;     