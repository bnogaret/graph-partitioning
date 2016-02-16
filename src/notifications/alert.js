'use strict';

function notification(title, text, type) {
  var snackbarContainer = document.querySelector('#snackbar-notification');
  snackbarContainer.style.opacity = 1;
  //icon  
  var icon = document.createElement('i');
  snackbarContainer.insertBefore(icon, snackbarContainer.firstChild);

  var data = {
    message: title + ' ' + text,
    timeout: 2000,
    actionText: 'Undo',
  };

  switch (type) {
  case 'alert':
    snackbarContainer.style.color = '#ff0000';
    snackbarContainer.style.backgroundColor = '#ffb3b3';
    icon.id = 'alert-icon';
    icon.className = 'fa fa-times-circle fa-5px';
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
    break;
  case 'notification':
    snackbarContainer.style.color = '#0000cc';
    snackbarContainer.style.backgroundColor = '#ccccff';
    icon.id = 'notification-icon';
    icon.className = 'fa fa-info-circle fa-5px';
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
    break;
  case 'warning':
    snackbarContainer.style.color = '#cca300';
    snackbarContainer.style.backgroundColor = '#ffd633';
    icon.id = 'warning-icon';
    icon.className = 'fa fa-exclamation-triangle fa-5px';
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
    break;
  default:
    break;
  }

  setTimeout(function () {
    snackbarContainer.style.opacity = 0;
    snackbarContainer.removeChild(icon);
  }, 2000);

}

module.exports.notification = notification;

// Dynamically create a snackbar
/* 
const test = document.getElementById('test');
var notif = document.createElement('div');
test.appendChild(notif);

function notification(title, text, type) {

  if (type === 'warning') {
    notif.id = 'warning';
    notif.className = 'mdl-js-snackbar mdl-snackbar';
    var notifText = document.createElement('div');
    notifText.className = 'mdl-snackbar__text';
    var notifAction = document.createElement('button');
    notifAction.className = 'mdl-snackbar__action';
    notifAction.type = 'button';

    notif.appendChild(notifText);
    notif.appendChild(notifAction);

    var data = {
      message: title + ' ' + text,
      timeout: 2000,
      actionText: 'Undo',
    };
  }
  notif.MaterialSnackbar.showSnackbar(data);
}
*/