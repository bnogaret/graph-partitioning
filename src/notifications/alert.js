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
//
// Uploading file
//

var up = {
  layoutNotification: document.querySelector('#layout-notification'),
  table: document.createElement('table'),
  tr: document.createElement('tr'),
  td1: document.createElement('td'),
  spinner: document.createElement('div'),
  td2: document.createElement('td'),
  snackbarText: document.createElement('div'),
  snackbarNotification: document.createElement('div'),
  separator: document.createElement('div'),
  circle: null,
};

up.spinner.id = 'spinner';
up.snackbarText.className = 'snackbar_text';
up.snackbarNotification.className = 'snackbar';
up.separator.className = 'separator';

function init(message) {
  up.td1.appendChild(up.spinner);
  up.td2.appendChild(up.snackbarText);
  up.tr.appendChild(up.td1);
  up.tr.appendChild(up.td2);
  up.table.appendChild(up.tr);
  up.snackbarNotification.appendChild(up.table);
  up.layoutNotification.appendChild(up.snackbarNotification);
  up.layoutNotification.appendChild(up.separator);
  up.circle = new ProgressBar.Circle('#spinner', {
    color: '#4CC417',
    strokeWidth: 3,
    trailWidth: 1,
    text: {
      value: '0'
    },
    step: function (state, bar) {
      bar.setText((bar.value() * 100).toFixed(0));
    }
  });
  up.circle.animate(0);
  up.snackbarText.innerHTML = message;
  up.spinner.style.opacity = '0';
}

function progressSpinner(step, data, message) {
  switch (step) {
  case 'upload_step':
    up.spinner.style.opacity = '1';
    up.snackbarText.innerHTML = message;
    up.circle.animate(data);
    break;
  case 'upload_end':
    up.snackbarText.innerHTML = message;
    break;
  case 'download_start':
    up.spinner.style.opacity = '0';
    up.snackbarText.innerHTML = message;
    up.circle.animate(data);
    break;
  case 'download_step':
    up.spinner.style.opacity = '1';
    setTimeout(() => {
      up.snackbarText.innerHTML = message;
      up.circle.animate(data);
    }, 1500);
    break;
  case 'download_end':
    setTimeout(() => {
      up.snackbarText.innerHTML = message;
    }, 1500);
    setTimeout(() => {
      up.layoutNotification.removeChild(up.snackbarNotification);
      up.layoutNotification.removeChild(up.separator);
    }, 6000);
    break;
  default:
    break;
  }
}

module.exports.notification = notification;
module.exports.progressSpinner = progressSpinner;
module.exports.init = init;
