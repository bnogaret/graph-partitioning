'use strict';

const fs = require('fs');
var App = {};
const Viva = require('../libs/vivagraph.min.js');

var renderLinksBtn = document.getElementById('displayLinksBtn');
var switchColor = document.getElementById('displayColors');
var color = false;
var runGraphBtn = document.getElementById('run-graph');
var pauseGraphBtn = document.getElementById('pause-graph');

runGraphBtn.addEventListener('click', () => {
  App.renderer.resume();
});

pauseGraphBtn.addEventListener('click', () => {
  App.renderer.pause();
});

function onLoad(file) {
  console.log('on load works');
  App.fileInput = file;

  // In case we have already something draw
  if (typeof App.graph !== 'undefined') {
    App.renderer.dispose();
  }

  // TODO Check if everything is working this create random graph
  // App.graphGenerator = Viva.Graph.generator();
  App.graph = Viva.Graph.graph(); // App.graphGenerator.grid(50, 10);
  App.layout = Viva.Graph.Layout.forceDirected(App.graph);
  App.graphics = Viva.Graph.View.webglGraphics();
  App.renderer = Viva.Graph.View.renderer(App.graph, {
    layout: App.layout,
    graphics: App.graphics,
    container: document.getElementById('graph-container'),
  });

  // Step 1. Get the library to read and draw

  var contents = fs.readFileSync(App.fileInput, 'utf-8');
  var graph = App.graph;

  // Step 2. Each value of the array correspond to one line
  var contentsByLine = contents.split('\n');

  // Step 3. Get the number of nodes (first value first line)
  // And the others parameters (number of edges(we don't use it in our case), fmt, ncon)
  // Thanks to the the same algorithm has step 4.

  function getInteger(target) {
    var firstLine = [];
    var temp = [];
    var outFirstline = parseInt(target, 10);
    var nlFirstLine = target;

    while (outFirstline) {
      firstLine.push(outFirstline);
      temp = nlFirstLine.replace(outFirstline, '');
      nlFirstLine = temp;
      outFirstline = parseInt(nlFirstLine, 10);
    }

    return firstLine;
  }

  var firstLine = getInteger(contentsByLine[0]);

  function getFmtNcon(numberOfNodes, numberOfEdges) {
    // Get only fmt and ncon
    var nlFirstLine = contentsByLine[0];
    var temp = [];

    temp = nlFirstLine.replace(numberOfNodes, '');
    nlFirstLine = temp;
    temp = nlFirstLine.replace(numberOfEdges, '');
    // suppress all blank space
    nlFirstLine = temp.replace(/ /g, '');

    return nlFirstLine;
  }

  var numberOfNodes = firstLine[0];

  function nRender() {
    for (var i = 1; i < numberOfNodes + 1; i++) {
      var nlByLine = contentsByLine[i];
      var out = parseInt(nlByLine, 10);

      while (out) {
        graph.addLink(i, out);
        var temp = nlByLine.replace(out, '');
        nlByLine = temp;
        out = parseInt(nlByLine, 10);
      }
    }
  }
  switch (firstLine.length) {
  case 1:
  case 2:
    nRender();
    break;
  case 3:
    var fmtNcon = getFmtNcon(numberOfNodes, numberOfEdges, contentsByLine[0]); // <!--blank space at the end-->

    if (fmtNcon.length === 4) { // <!--blank space at the end-->
      var fmt = fmtNcon;
      fmtRender();
    } else {
      var fmt = [];
      var ncon = [];

      for (var i = 0; i < 3; i++) {
        fmt.push(fmtNcon[i]);
      }

      for (var i = 3; i < fmtNcon.length - 1; i++) {
        ncon.push(fmtNcon[i]);
      }

      fmtNconRender();
    }
    break;
  default:
    break;
  }

  App.numberOfNodes = numberOfNodes;

  // Step 4. Get the links for each lines
  // As there are blank space and integer we catch first integer
  // remove it from the line and catch the other one and remove it
  // and so on...
  // And then draw them for each lines

  // First and Second case of the switch (numbers of nodes, numbers of edges)


  // Last case of the switch with only fmt
  // <!-- undefined links[links.length - 1] -->
  function fmtRender() {
    console.log('fmtRender');

    // Links the last values is undefined
    // Handle weight equal to 0
    var links = [];
    var nlByLine = [];
    var out = 1;
    var zeroCase = 0;
    var temp = [];

    for (var i = 1; i < numberOfNodes + 1; i++) {
      nlByLine = contentsByLine[i];
      links = [];
      out = 1;

      while (out) {
        out = parseInt(nlByLine, 10);
        // prevent from quitting the loop in case out === 0
        if (out === 0) {
          links.push(0);
          temp = nlByLine.replace(out, '');
          nlByLine = temp;
          out = 1;
        } else {
          links.push(out);
          temp = nlByLine.replace(out, '');
          nlByLine = temp;
        }
      }

      // Drawing part
      // case fmt = 001
      // edges weight links[j+1]
      if (fmt[0] === '0' && fmt[1] === '0' && fmt[2] === '1') {
        for (var j = 0; j < links.length - 2; j++) {
          if (j % 2 === 0) { // first values is the edges and second is the weight of the edge
            graph.addLink(i, links[j]);
            console.log('weight edges 001: ' + links[j + 1]);
          }
        }
      }
      // case fmt = 101
      // edges weight links[j+1]
      // links[0] = size of the nodes
      if (fmt[0] === '1' && fmt[1] === '0' && fmt[2] === '1') {
        for (var j = 1; j < links.length - 2; j++) {
          if (j % 2 === 0) { // first values is the edges and second is the weight of the edge
            graph.addLink(i, links[j]);
            console.log('weight edges 001: ' + links[j + 1]);
          }
        }
      }

      // case fmt = 011
      // nodes weigth links[0]
      // edges weight links[j+1]
      if (fmt[0] === '0' && fmt[1] === '1' && fmt[2] === '1') {
        for (var j = 1; j < links.length - 2; j++) {
          if (j % 2 === 1) { // first values is the edges and second is the weight of the edge
            graph.addLink(i, links[j]);
            console.log('weight edges 011:' + links[j + 1]);
          }
        }
      }

      // case fmt = 111
      // nodes size links[0]
      // nodes weigth links[1]
      // edges weight links[j+1]
      if (fmt[0] === '1' && fmt[1] === '1' && fmt[2] === '1') {
        for (var j = 2; j < links.length - 2; j++) {
          if (j % 2 === 1) { // first values is the edges and second is the weight of the edge
            graph.addLink(i, links[j]);
            console.log('weight edges 011:' + links[j + 1]);
          }
        }
      }

      // case fmt = 010
      // nodes weigth links[0]
      if (fmt[0] === '0' && fmt[1] === '1' && fmt[2] === '0') {
        for (var j = 1; j < links.length - 1; j++) {
          graph.addLink(i, links[j]);
          console.log('weight vertices 010:' + links[0]);
        }
      }

      // case fmt = 110
      // nodes size    links[0]
      // nodes weigth  links[1]
      // edges weight  links[j+1]
      if (fmt[0] === '1' && fmt[1] === '1' && fmt[2] === '0') {
        for (var j = 1; j < links.length - 1; j++) {
          graph.addLink(i, links[j]);
          console.log('weight vertices 010:' + links[0]);
        }
      }
    }
  }

  // Last case of the switch with fmt and ncon
  // <!--undefined links[links.length - 1] -->
  function fmtNconRender() {
    // Links the last values is undefined
    // Handle weight equal to 0
    var links = [];
    var nlByLine = [];
    var out = 1;
    var zeroCase = 0;
    var temp = [];
    var nconInt = parseInt(ncon, 10);

    for (var i = 1; i < numberOfNodes + 1; i++) {
      nlByLine = contentsByLine[i];
      links = [];
      out = 1;

      while (out) {
        out = parseInt(nlByLine, 10);
        // prevent from quitting the loop in case out === 0
        if (out === 0) {
          links.push(0);
          temp = nlByLine.replace(out, '');
          nlByLine = temp;
          out = 1;
        } else {
          links.push(out);
          temp = nlByLine.replace(out, '');
          nlByLine = temp;
        }
      }



      // Drawing part
      // <!-- if ncon = 0 -> undefined every case works except when the first ncon is equal to 0 -->
      // case fmt = 010
      // weight of the vertices = [0..ncon[0]]
      if (fmt[0] === '0' && fmt[1] === '1' && fmt[2] === '0') {
        // weight of the vertice
        for (var j = 0; j < nconInt; j++) {
          console.log('node: ' + i + ' ncons: ' + links[j]);
        }

        for (var j = nconInt; j < links.length - 1; j++) {
          console.log('edge: ' + links[j]);
        }
      }

      // case fmt = 110
      // nodes size links[0]
      // weight of the vertices = [1..ncon[0]]
      if (fmt[0] === '1' && fmt[1] === '1' && fmt[2] === '0') {
        // weight of the vertice
        for (var j = 1; j < nconInt + 1; j++) {
          console.log('node: ' + i + ' ncons: ' + links[j]);
        }

        for (var j = nconInt + 1; j < links.length - 1; j++) {
          console.log('edge: ' + links[j]);
        }
      }

      // case fmt = 011
      // weight of the vertices = [0..ncon[0]]

      // ncon%2 = 0
      if (fmt[0] === '0' && fmt[1] === '1' && fmt[2] === '1') {
        // weight of the vertice
        for (var j = 0; j < nconInt; j++) {
          console.log('node: ' + i + ' ncon: ' + links[j]);
        }

        if (nconInt % 2 === 0) {
          for (var j = nconInt; j < links.length - 2; j++) {
            if (j % 2 === 0) {
              graph.addLink(i, links[j]);
              console.log('weight edge: ' + links[j + 1]);
            }
          }
        }

        // ncon%2 = 1
        if (nconInt % 2 === 1) {
          for (var j = nconInt; j < links.length - 2; j++) {
            if (j % 2 === 1) {
              graph.addLink(i, links[j]);
              console.log('weight edges: ' + links[j + 1]);
            }
          }
        }
      }
      // case fmt = 111
      // nodes size links[0]
      // weight of the vertices = [0..ncon[0]]
      // ncon%2 = 0
      if (fmt[0] === '1' && fmt[1] === '1' && fmt[2] === '1') {
        // weight of the vertice
        for (var j = 1; j < nconInt + 1; j++) {
          console.log('node: ' + i + ' ncon: ' + links[j]);
        }

        if (nconInt % 2 === 0) {
          for (var j = nconInt + 1; j < links.length - 2; j++) {
            if (j % 2 === 0) {
              graph.addLink(i, links[j]);
              console.log('weight edge: ' + links[j + 1]);
            }
          }
        }

        // ncon%2 = 1
        if (nconInt % 2 === 1) {
          for (var j = nconInt + 1; j < links.length - 2; j++) {
            if (j % 2 === 1) {
              graph.addLink(i, links[j]);
              console.log('weight edges: ' + links[j + 1]);
            }
          }
        }
      }
    }
  }

  // Step 5. Render the graph


  renderLinksBtn.style.display = 'block';
  switchColor.style.display = 'block';


  App.layout = Viva.Graph.Layout.forceDirected(graph, {
    springLength: 50, // 10
    springCoeff: 0.0008, // 0.0005,
    dragCoeff: 0.01,
    gravity: -5.20,
    theta: 1,
    timestep: 1,
  });

  App.graphics.node(function (node) {
    return Viva.Graph.View.webglSquare(10, 0x1f77b4ff);
  });

  App.renderer = Viva.Graph.View.renderer(graph, {
    graphics: App.graphics,
    layout: App.layout,
    interactive: 'drag, scroll',
    renderLinks: false,
  });

  App.renderer.run();
  App.renderer.pause();
}

// Variable define within index.js in order to name correctly the output
App.numberOfPartitions = 0;

function setNumberOfPartitions(n) {
  App.numberOfPartitions = n;
}

// Variable define within index.js in order to name correctly the output
App.isMesh = null;

function isMesh(mesh) {
  App.isMesh = mesh;
}

function addColor() {

  // Convert RGB values to hex rrggbb
  function fromRGBto32(rgbArr) {
    return rgbArr.reduce(function (s, v) {
      return s + ('0' + v.toString(16)).slice(-2);
    }, '') + 'ff'
  }
  // Random number
  function randomNumber() {
    return Math.floor(Math.random() * 255);
  }
  var r = 0;
  var g = 0;
  var b = 0;
  // Create random colors
  var randomColors = [];

  // Convert number decimal number to hexadecimal
  for (var i = 0; i < App.numberOfPartitions; i++) {
    r = randomNumber();
    g = randomNumber();
    b = randomNumber();
    randomColors.push(fromRGBto32([r, g, b]));
  }

  // Read output file from metis
  if (App.isMesh) {
    var output = App.fileInput + '.npart.' + App.numberOfPartitions;
  } else {
    var output = App.fileInput + '.part.' + App.numberOfPartitions;
  }

  function addColors(link) {
    var outputs = fs.readFileSync(link, 'utf-8');
    var processors = outputs.split('\n');

    for (var i = 1; i < App.numberOfNodes + 1; i++) {
      App.graphics.getNodeUI(i).color = '0x' + randomColors[parseInt(processors[i - 1], 10)];
    }
  }

  addColors(output);
  App.renderer.rerender();
}

function removeColor() {
  // Step 6. Colors
  // Colors up until (20 processors for more add more colors)
  var defaultColor = 0x1f77b4ff;

  // Read output file from metis
  if (App.isMesh) {
    var output = App.fileInput + '.npart.' + App.numberOfPartitions;
  } else {
    var output = App.fileInput + '.part.' + App.numberOfPartitions;
  }

  function addColors(link) {
    var outputs = fs.readFileSync(link, 'utf-8');
    var processors = outputs.split('\n');

    for (var i = 1; i < App.numberOfNodes + 1; i++) {
      App.graphics.getNodeUI(i).color = defaultColor;
    }
  }

  addColors(output);
  App.renderer.rerender();
}


switchColor.addEventListener('click', function () {
  if (color === false) {
    addColor();
    color = !color;
  } else {
    removeColor();
    color = !color;
  }
}, false);

// part of code which render new graph
function loadNewGraphWithLinks() {
  App.renderer.dispose();
  App.renderer = null;
  // Resize vertices
  if (!App.isMesh) {
    App.graphics.node(function (node) {
      return Viva.Graph.View.webglSquare(100, 0x1f77b4ff);
    });
  }

  App.renderer = Viva.Graph.View.renderer(App.graph, {
    graphics: App.graphics,
    layout: App.layout,
    interactive: 'drag, scroll',
    renderLinks: true,
  });

  App.renderer.run();
}

// Dialog alert when you click on the link button

var renderLinksBtn = document.getElementById('displayLinksBtn');
var dialog = document.querySelector('dialog');

renderLinksBtn.addEventListener('click', function () {
  dialog.showModal();  
});

dialog.querySelector('.agree').addEventListener('click', function () {
  loadNewGraphWithLinks();
  dialog.close();
  color = false;
});

dialog.querySelector('.close').addEventListener('click', function () {
  dialog.close();
});


// Preview with metis example
function preview(type) {
  // Case we draw a new graph
  renderLinksBtn.style.display = 'none';
  switchColor.style.display = 'none';
  // In case we have already something draw
  if (typeof App.graph !== 'undefined') {
    App.renderer.dispose();
  }
  console.log('preview is working');
  switch (type) {
  case 'graph':
    var file = fs.readFileSync(process.cwd() + '/static/graph.txt', 'utf-8');
    break;
  case 'mesh':
    var file = fs.readFileSync(process.cwd() + '/static/tet.mesh', 'utf-8');
  default:
    break;
  }

  App.graph = Viva.Graph.graph();
  App.layout = Viva.Graph.Layout.forceDirected(App.graph);
  App.graphics = Viva.Graph.View.webglGraphics();
  App.renderer = Viva.Graph.View.renderer(App.graph, {
    layout: App.layout,
    graphics: App.graphics,
    container: document.getElementById('preview'),
  });

  function getInteger(target) {
    var firstLine = [];
    var temp = [];
    var outFirstline = parseInt(target, 10);
    var nlFirstLine = target;

    while (outFirstline) {
      firstLine.push(outFirstline);
      temp = nlFirstLine.replace(outFirstline, '');
      nlFirstLine = temp;
      outFirstline = parseInt(nlFirstLine, 10);
    }
    return firstLine;
  }

  var graph = App.graph;
  var contentsByLine = file.split('\n');
  var firstLine = getInteger(contentsByLine[0]);
  var numberOfNodes = firstLine[0];

  nRender();

  App.numberOfNodes = numberOfNodes;

  function nRender() {
    for (var i = 1; i < numberOfNodes + 1; i++) {
      var nlByLine = contentsByLine[i];
      var out = parseInt(nlByLine, 10);

      while (out) {
        graph.addLink(i, out);
        var temp = nlByLine.replace(out, '');
        nlByLine = temp;
        out = parseInt(nlByLine, 10);
      }
    }
  }

  App.layout = Viva.Graph.Layout.forceDirected(graph, {
    springLength: 80, // 10
    springCoeff: 0.0008,
    dragCoeff: 0.01,
    gravity: -5.20,
    theta: 1,
    timestep: 1,
  });

  App.graphics.node(function (node) {
    return Viva.Graph.View.webglSquare(10, 0x1f77b4ff);
  });

  App.renderer = Viva.Graph.View.renderer(graph, {
    graphics: App.graphics,
    layout: App.layout,
    interactive: 'drag, scroll',
    renderLinks: true,
  });
  App.renderer.run();
}

// Rendering some random mesh
function intro() {
  // In case we have already something draw
  if (typeof App.graph !== 'undefined') {
    App.renderer.dispose();
  }

  App.graph = Viva.Graph.graph();
  App.layout = Viva.Graph.Layout.forceDirected(App.graph);
  App.graphics = Viva.Graph.View.webglGraphics();
  App.renderer = Viva.Graph.View.renderer(App.graph, {
    layout: App.layout,
    graphics: App.graphics,
    container: document.getElementById('preview'),
  });

  var graph = App.graph;

  App.layout = Viva.Graph.Layout.forceDirected(graph, {
    springLength: 50, // 10
    springCoeff: 0.0008, // 0.0005,
    dragCoeff: 0.01,
    gravity: -5.20,
    theta: 1,
    timestep: 1,
  });

  App.graphics.node(function (node) {
    return Viva.Graph.View.webglSquare(10, 0x1f77b4ff);
  });

  App.renderer = Viva.Graph.View.renderer(graph, {
    graphics: App.graphics,
    layout: App.layout,
    interactive: 'drag, scroll',
    renderLinks: true,
  });
  App.renderer.run();

  beginAddNodesLoop(graph);


}
// Add some effect to the graph
function beginAddNodesLoop(graph) {
  var i = 0,
    m = 10,
    n = 50;
  var addInterval = setInterval(function () {
    graph.beginUpdate();
    for (var j = 0; j < m; ++j) {
      var node = i + j * n;
      if (i > 0) {
        graph.addLink(node, i - 1 + j * n);
      }
      if (j > 0) {
        graph.addLink(node, i + (j - 1) * n);
      }
    }
    i++;
    graph.endUpdate();
    if (i >= n) {
      clearInterval(addInterval);
      setTimeout(function () {
        beginRemoveNodesLoop(graph);
      }, 10000);
    }
  }, 500);
}

function beginRemoveNodesLoop(graph) {
  var nodesLeft = [];
  graph.forEachNode(function (node) {
    nodesLeft.push(node.id);
  });
  var removeInterval = setInterval(function () {
    var nodesCount = nodesLeft.length;
    if (nodesCount > 0) {
      var nodeToRemove = Math.min((Math.random() * nodesCount) << 0, nodesCount - 1);
      graph.removeNode(nodesLeft[nodeToRemove]);
      nodesLeft.splice(nodeToRemove, 1);
    }
    if (nodesCount === 0) {
      clearInterval(removeInterval);
      setTimeout(function () {
        beginAddNodesLoop(graph);
      }, 100);
    }
  }, 500);
}

module.exports.onLoad = onLoad;
module.exports.loadNewGraphWithLinks = loadNewGraphWithLinks;
module.exports.preview = preview;
module.exports.intro = intro;
module.exports.setNumberOfPartitions = setNumberOfPartitions;
module.exports.isMesh = isMesh;