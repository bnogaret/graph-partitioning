'use strict';

var footer = document.getElementById('footer');

// Read performance value from graph partitionning library
function readValue(input, keyword) {
  var reGex = new RegExp(keyword + ': +([0-9]+)' + '|' + keyword + ':*[ \t]*([0-9]\.[0-9]*)', 'i');
  reGex.exec(input);
  reGex.lastIndex = 0;
  console.log(keyword + ': ' + RegExp.$1 + RegExp.$2);
  return RegExp.$1 + RegExp.$2;
}

// Show the footer
function changeOpacity(show) {
  switch (show) {
    case true:
      footer.style.opacity = '1';
      break;
    case false:
      footer.style.opacity = '0';
      break;
    default:
      break;
  }
}

// Read the performance from the library
var perfValues = {};

function perf(input) {
  perfValues.vertices = readValue(input, '#Vertices');
  perfValues.edges = readValue(input, '#Edges');
  perfValues.parts = readValue(input, '#Parts');
  perfValues.edgecut = readValue(input, 'Edgecut');
  perfValues.communicationVolume = readValue(input, 'communication volume');
  perfValues.io = readValue(input, 'I\/O');
  perfValues.partitioning = readValue(input, 'Partitioning');
  perfValues.reporting = readValue(input, 'Reporting');
  perfValues.maxMemoryUsed = readValue(input, 'Max memory used');

  (function (perfValues) {
    var edgecut = document.getElementById('edgecut');
    edgecut.innerHTML += perfValues.edgecut;
    var communication = document.getElementById('communication-volume');
    communication.innerHTML += perfValues.communicationVolume;
    var io = document.getElementById('IO');
    io.innerHTML += perfValues.io + ' sec';
    var partitioning = document.getElementById('partitioning');
    partitioning.innerHTML += perfValues.partitioning + ' sec';
    var reporting = document.getElementById('reporting');
    reporting.innerHTML += perfValues.reporting + ' sec';
    var memory = document.getElementById('max-memory-used');
    memory.innerHTML += perfValues.maxMemoryUsed + 'MB';
  })(perfValues);

  changeOpacity(true);
}



module.exports.perf = perf;
