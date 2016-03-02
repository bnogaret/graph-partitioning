/* global componentHandler */

'use strict';

function notification(message, type) {
  const layoutNotification = document.querySelector('#layout-notification');

  const separator = document.createElement('div');
  separator.className = 'separator';

  const snackbarNotification = document.createElement('div');
  snackbarNotification.className = 'mdl-js-snackbar mdl-snackbar mdl-shadow--4dp';

  const icon = document.createElement('i');
  icon.className = 'fa fa-10px';

  const snackbarText = document.createElement('div');
  snackbarText.className = 'mdl-snackbar__text';

  const snackbarAction = document.createElement('button');
  snackbarAction.className = 'mdl-snackbar__action';
  snackbarAction.type = 'button';

  snackbarNotification.appendChild(icon);
  snackbarNotification.appendChild(snackbarText);
  snackbarNotification.appendChild(snackbarAction);
  componentHandler.upgradeElement(snackbarNotification);

  layoutNotification.appendChild(snackbarNotification);
  layoutNotification.appendChild(separator);

  var data = {
    'message': message,
    'actionText': 'Undo',
  };

  switch (type) {
    case 'alert':
      snackbarNotification.className += ' alert';
      data.timeout = 50000;
      icon.className += ' fa-times-circle';
      break;
    case 'warning':
      snackbarNotification.className += ' warning';
      data.timeout = 25000;
      icon.className += ' fa-exclamation-triangle';
      break;
    case 'notification':
    default:
      snackbarNotification.className += ' notification';
      data.timeout = 10000;
      icon.className += ' fa-info-circle';
      break;
  }

  snackbarNotification.MaterialSnackbar.showSnackbar(data);

  setTimeout(function () {
    layoutNotification.removeChild(snackbarNotification);
    layoutNotification.removeChild(separator);
  }, data.timeout);
}


function progressSpinner(message) {
  /**
      <div class="snackbar">
      <table>
        <tr>
          <td>
            <i class="fa fa-10px fa-info-circle"></i>
          </td>
          <td>
            <div class="snackbar_text">File is uploading</div>
          </td>
          <td>
            <span class="mdl-spinner mdl-js-spinner is-active"></span>
          </td>
          <td>
            <tspan id="spValue"></tspan>
          </td>
        </tr>
      </table>
    </div>
    <div class="separator"></div>
  */
  const layoutNotification = document.querySelector('#layout-notification');

  const table = document.createElement('table');

  const tr = document.createElement('tr');

  const td1 = document.createElement('td');

  const icon = document.createElement('i');
  icon.className = 'fa fa-10px fa-info-circle';
  td1.appendChild(icon);

  const td2 = document.createElement('td');
  const snackbarText = document.createElement('div');
  snackbarText.className = 'snackbar_text';
  snackbarText.innerHTML = message;
  td2.appendChild(snackbarText);

  const td3 = document.createElement('td');
  const spinner = document.createElement('span');
  spinner.className = 'mdl-spinner mdl-js-spinner is-active';
  td3.appendChild(spinner);

  const td4 = document.createElement('td');
  const valueSpinner = document.createElement('tspan');
  valueSpinner.id = 'spValue';
  td4.appendChild(valueSpinner);

  const snackbarNotification = document.createElement('div');
  snackbarNotification.className = 'snackbar';

  const separator = document.createElement('div');
  separator.className = 'separator';

  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);
  tr.appendChild(td4);
  table.appendChild(tr);
  snackbarNotification.appendChild(table);
  componentHandler.upgradeElement(spinner);
  layoutNotification.appendChild(snackbarNotification);
  layoutNotification.appendChild(separator);


  setTimeout(function () {
    layoutNotification.removeChild(snackbarNotification);
    layoutNotification.removeChild(separator);
  }, 5000);
}

module.exports.notification = notification;
module.exports.progressSpinner = progressSpinner;
