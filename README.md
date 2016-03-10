![Partify logo](/static/logo_wide.png)
-----

## Presentation

Partify is a desktop application, using web technologies based on <strong>[Electron](http://electron.atom.io/)</strong> technologies and <strong>[Vivagraph](https://github.com/anvaka/VivaGraphJS)</strong> library using webGL to display the graph. We are using <strong>[Material Design Lite](https://www.getmdl.io/)</strong> for the GUI and <strong>[Font Awesome](https://fortawesome.github.io/Font-Awesome/icons/)</strong> for some icons. Partify allows everyone to partition, visualize them graph and mesh using <strong>[Metis](http://glaros.dtc.umn.edu/gkhome/metis/metis/overview)</strong> and <strong>[ParMetis](http://glaros.dtc.umn.edu/gkhome/metis/parmetis/overview)</strong> library. Partitioning your graph or mesh, enhance the computation by distributed it to different processors. With partify you can do it on your computer or remotely through a server. Currently available for <strong>Windows</strong>, Partify is also available on <strong>Linux</strong> (tested on Ubuntu) and include <strong>[Chaco](http://www3.cs.stonybrook.edu/~algorith/implement/chaco/implement.shtml)</strong> library.

It was made, under [Cranfield University](https://www.cranfield.ac.uk/)'s monitoring during group project, by Marcin Bojarski, Baptiste Nogaret, Anthony Razafindramanana and Maciej Smolarczyk.

## Basic Partify Usage

Users are allowed to set a new connection by clicking on server menu, by adding a new graph or mesh the user access to the different Metis and ParMetis options. Once the computation done, intrinsic's performance of the library are shown to the users (execution time, edgecuts ...).

Two examples of Metis/ParMetis input can be access through the main windows of Partify. The graph is composed of 766 nodes and 1314 edges whereas the mesh is made of a 3D region, using tetrahedral elements.

## Installation

1. Install node.js globally.
2. Clone the repository :

  ```git clone  https://github.com/bnogaret/graph-partitioning.git```

3. Execute:

  ```npm install```

4. Install the parmetis and metis (mpmetis and gpmetis) executable in a directory named native. If you are on linux, install chaco too.
5. To start:

  ```npm start```

## Examples of visualization

Graph visualization:

![4elt graph visualization](/static/example_4elt_graph.png)

-----

Mesh visualization:

![tet mesh visualization](/static/example_tet_mesh.png)
