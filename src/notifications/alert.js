'use strict';

function notification (title, text, type) {

  var snackbarContainer = document.querySelector('#demo-snackbar-example');

  var data = {
    message: title + ' ' + text,
    timeout: 2000,
    actionText: 'Undo'
  };
  
  switch (type) {
  case 'alert':
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
    break;
  case 'notification':
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
    break;
  case 'warning':
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
    break;
  default:
    break;
  }

}

module.exports.notification = notification;