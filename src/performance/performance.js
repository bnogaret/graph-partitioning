'use strict';
const footer = document.getElementById('footer');
const vertices_edges = document.getElementById('vertices-edges');
var isMesh = null;

// Differents performance values depends on if it's a mesh or a graph
function setMesh(mesh) {
  isMesh = mesh;
}

// Read performance value from graph partitionning library
function readValue(input, keyword) {
  var reGex = new RegExp(keyword + ': +([0-9]+)' + '|' + keyword + '[ :=]*[ \t]*([0-9]\.[0-9]*)', 'i');
  reGex.exec(input);
  reGex.lastIndex = 0;
  console.log(keyword + ': ' + RegExp.$1 + RegExp.$2);
  return RegExp.$1 + RegExp.$2;
}

// Read the performance from the library
var perfValues = {};

function perf(input) {
  perfValues.elements = readValue(input, '#Elements');
  perfValues.nodes = readValue(input, '#Nodes');
  perfValues.vertices = readValue(input, '#Vertices');
  perfValues.edges = readValue(input, '#Edges');
  perfValues.parts = readValue(input, '#Parts');
  perfValues.edgecut = readValue(input, 'Edgecut');
  perfValues.communicationVolume = readValue(input, 'communication volume');
  perfValues.io = readValue(input, 'I\/O');
  perfValues.partitioning = readValue(input, 'Partitioning');
  perfValues.reporting = readValue(input, 'Reporting');
  perfValues.maxMemoryUsed = readValue(input, 'Max memory used');

  var edgecut = document.getElementById('footer-edgecut');
  edgecut.innerHTML = perfValues.edgecut;
  var communication = document.getElementById('footer-communication');
  communication.innerHTML = perfValues.communicationVolume;

  var partitioning = document.getElementById('footer-partitioning');
  var totalTime = parseFloat(perfValues.partitioning, 10) + parseFloat(perfValues.io, 10) + parseFloat(perfValues.reporting, 10);
  partitioning.innerHTML = totalTime + ' sec';

  var memory = document.getElementById('footer-memory');
  memory.innerHTML = perfValues.maxMemoryUsed + ' MB';

  if (isMesh) {
    var elements = document.getElementById('elements_vertices');
    elements.innerHTML = 'Elements';
    var reporting = document.getElementById('footer-reporting');
    reporting.innerHTML = perfValues.elements;
    var nodes = document.getElementById('nodes_edges');
    nodes.innerHTML = 'Nodes';
    var io = document.getElementById('footer-io');
    io.innerHTML = perfValues.nodes;
  } else {
    var vertices = document.getElementById('elements_vertices');
    vertices.innerHTML = 'Vertices';
    var reporting = document.getElementById('footer-reporting');
    reporting.innerHTML = perfValues.vertices;
    var edges = document.getElementById('nodes_edges');
    edges.innerHTML = 'Edges';
    var io = document.getElementById('footer-io');
    io.innerHTML = perfValues.edges;
  }

  footer.style.display = 'block';
}

function perfParmetis(input) {
  perfValues.edgecut = readValue(input, 'Cut');

  var edgecut = document.getElementById('footer-edgecut');
  edgecut.innerHTML = perfValues.edgecut;
  var communication = document.getElementById('footer-communication');
  communication.innerHTML = '--';
  var io = document.getElementById('footer-io');
  io.innerHTML = '--';
  var partitioning = document.getElementById('footer-partitioning');
  partitioning.innerHTML = '--';
  var reporting = document.getElementById('footer-reporting');
  reporting.innerHTML = '--';
  var memory = document.getElementById('footer-memory');
  memory.innerHTML = '--';
  var vertices = document.getElementById('elements_vertices');
  vertices.innerHTML = 'Vertices';
  var edges = document.getElementById('nodes_edges');
  edges.innerHTML = 'Edges';
  footer.style.display = 'block';
}

function perfChaco(input) {
  perfValues.vertices = readValue(input, '# vertices');
  perfValues.edges = readValue(input, '# edges');
  perfValues.edgecut = readValue(input, 'Edge Cuts');
  // perfValues.io = readValue(input, 'input');
  // perfValues.partitioning = readValue(input, 'partitioning');
  perfValues.reporting = readValue(input, 'Total time:');
  console.log(perfValues.reporting);

  var edgecut = document.getElementById('footer-edgecut');
  edgecut.innerHTML = perfValues.edgecut;
  var communication = document.getElementById('footer-communication');
  communication.innerHTML = '--';
  var io = document.getElementById('footer-io');
  io.innerHTML = perfValues.edges;
  var partitioning = document.getElementById('footer-partitioning');
  partitioning.innerHTML = perfValues.reporting + ' sec';
  var reporting = document.getElementById('footer-reporting');
  reporting.innerHTML = perfValues.vertices;
  var memory = document.getElementById('footer-memory');
  memory.innerHTML = '--';
  var vertices = document.getElementById('elements_vertices');
  vertices.innerHTML = 'Vertices';
  var edges = document.getElementById('nodes_edges');
  edges.innerHTML = 'Edges';
  footer.style.display = 'block';
}

function hide() {
  footer.style.display = 'none';
}



module.exports.perf = perf;
module.exports.hide = hide;
module.exports.setMesh = setMesh;
module.exports.perfChaco = perfChaco;
module.exports.perfParmetis = perfParmetis;
