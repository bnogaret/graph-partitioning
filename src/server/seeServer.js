'use strict';

const localDatabase = require('../db/localDatabase.js').localDatabase;

const buttonClose = document.querySelector('#button-close');
const tbody = document.querySelector('tbody');

let rows = '';
const db = new localDatabase();

db.getServers().forEach((i) => {
  rows += `<tr>
    <td class="mdl-data-table__cell--non-numeric">${i.host}</td>
    <td class="mdl-data-table__cell--non-numeric">${i.username}</td>
    <td>${i.port}</td>
    <td class="mdl-data-table__cell--non-numeric">${i.defaultPath}</td>
  </tr>`;
});

console.log(tbody);
console.log(rows);

tbody.innerHTML = rows;

buttonClose.addEventListener('click', () => {
  window.close();
});
