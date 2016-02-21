/* global componentHandler */

'use strict';

function notification(title, text, type) {
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
    message: title + ' ' + text,
    actionText: 'Undo',
  };

  switch (type) {
    case 'alert':
      snackbarNotification.className += ' alert';
      data.timeout = 10000;
      icon.className += ' fa-times-circle';
      break;
    case 'warning':
      snackbarNotification.className += ' warning';
      data.timeout = 75000;
      icon.className += ' fa-exclamation-triangle';
      break;
    case 'notification':
    default:
      snackbarNotification.className += ' notification';
      data.timeout = 5000;
      icon.className += ' fa-info-circle';
      break;
  }

  snackbarNotification.MaterialSnackbar.showSnackbar(data);

  setTimeout(function () {
    layoutNotification.removeChild(snackbarNotification);
    layoutNotification.removeChild(separator);
  }, data.timeout);
}

module.exports.notification = notification;
