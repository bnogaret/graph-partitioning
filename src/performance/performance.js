'use strict';

// Read performance value from graph partitionning library
function readValue(input, keyword) {
  var reGex = new RegExp(keyword + '[:= ]+([0-9]+.[0-9]+)|' + keyword + '[:= ]+(\d+)', 'i');
  reGex.exec(input);
  console.log('regex: ' + RegExp.$1);
}

var input = 'iptype=grow, dbglvl=0, ufactor=1.001, no2hop=NO, minconn=NO, contig=NO, nooutput=NO, seed=-1, niter=5, ncuts=1,,Recursive Partitioning ------------------------------------------------------, - Edgecut: 462, communication volume:';

readValue(input, 'ufactor');

function changeOpacity(index) {
  var footer = document.getElementById('footer');
  switch (index) {
    case true:
      footer.style.opacity = '0';
      break;
    case false:
      footer.style.opacity = '1';
      break;
    default:
      break;
  }
}

module.exports.changeOpacity = changeOpacity;

// Show the performance of the rendering library
// fps
/*
var lastLoop = new Date().getTime();
var test = document.querySelector('#fps'); 

setInterval(() => {
  var  thisLoop = new Date().getTime();
  var fps = 1000 / (thisLoop - lastLoop);
  lastLoop = thisLoop;
  test.innerHTML = fps  + ' FPS';  
}, 1000);
*/