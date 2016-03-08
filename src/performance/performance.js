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
  var io = document.getElementById('footer-io');
  io.innerHTML = perfValues.io + ' sec';
  var partitioning = document.getElementById('footer-partitioning');
  partitioning.innerHTML = perfValues.partitioning + ' sec';
  var reporting = document.getElementById('footer-reporting');
  reporting.innerHTML = perfValues.reporting + ' sec';
  var memory = document.getElementById('footer-memory');
  memory.innerHTML = perfValues.maxMemoryUsed + ' MB';

  if (isMesh) {
    // Nodes and Elements will be placed on the top through absolute position
    var e_n = document.getElementById('v_e');
    e_n.innerHTML = 'Elements: ' + perfValues.elements + ' Nodes: ' + perfValues.nodes;
  } else {
    // Vertices and edges will be placed on the top through absolute position
    var v_e = document.getElementById('v_e');
    v_e.innerHTML = 'Vertices: ' + perfValues.vertices + ' Edges: ' + perfValues.edges;
  }

  footer.style.display = 'block';
  vertices_edges.style.display = 'block';
}

function perf_chaco(input) {
  perfValues.vertices = readValue(input, '# vertices');
  perfValues.edges = readValue(input, '# edges');
  perfValues.edgecut = readValue(input, 'Edge Cuts');
  perfValues.io = readValue(input, 'input');
  perfValues.partitioning = readValue(input, 'partitioning');
  perfValues.reporting = readValue(input, 'Total time');


  var edgecut = document.getElementById('footer-edgecut');
  edgecut.innerHTML = perfValues.edgecut;
  var communication = document.getElementById('footer-communication');
  communication.innerHTML = '--';
  var io = document.getElementById('footer-io');
  io.innerHTML = perfValues.io + ' sec';
  var partitioning = document.getElementById('footer-partitioning');
  partitioning.innerHTML = perfValues.partitioning + ' sec';
  var reporting = document.getElementById('footer-reporting');
  reporting.innerHTML = perfValues.reporting + ' sec';
  var memory = document.getElementById('footer-memory');
  memory.innerHTML = '--';


    var e_n = document.getElementById('v_e');
    e_n.innerHTML = 'Vertices: ' + perfValues.vertices + ' Edges: ' + perfValues.edges;


  footer.style.display = 'block';
  vertices_edges.style.display = 'block';
}

function hide() {
  footer.style.display = 'none';
  vertices_edges.style.display = 'none';
}



module.exports.perf = perf;
module.exports.hide = hide;
module.exports.setMesh = setMesh;
module.exports.perf_chaco = perf_chaco;