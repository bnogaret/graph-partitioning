'use strict';

const checkbox = document.querySelector('#show-password');
const password = document.querySelector('#password');
const buttonClose = document.getElementById('button-close');
const buttonOk = document.querySelector('#button-ok');
const introduction = document.querySelector('#intro-text');

checkbox.addEventListener('click', () => {
  if (checkbox.checked) {
    password.type = 'text';
  } else {
    password.type = 'password';
  }
});

buttonClose.addEventListener('click', () => {
  window.close();
});

buttonOk.addEventListener('click', () => {
  console.log(password.value);
  window.close();
});

introduction.innerHTML = 'TEST';
