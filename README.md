# graph-partitioning

Group project for Cranfield University.

## Presentation
<p>
Partify is a desktop application, using web technologies based on <strong>atom shell (electron)</strong> technologies and <strong>vivagraph</strong> library using webGL. Partify allows everyone to partition, visualize them graph and mesh using <strong>Metis</strong> and <strong>ParMetis</strong> library. Partitionning your graph or mesh, enhance the computation by distributed it to different processors. With partify you can do it on your computer or remotly through a server. Currently available for <strong>Windows</strong> Partify is also available on Linux and include chaco library.
</p>
<p>
It was made, under Cranfield University's monitoring during group project, by Marcin Bojarski, Baptiste Nogaret, Anthony Razafindramanana and Maciej Smolarczyk.
</p>
<h2 class="Brannboll">Basic Partify Usage</h2>
<p>
Users are allowed to set a new connection by clicking on server menu, by adding a new graph or mesh the user access to the different Metis and ParMetis options. Once the computation done, intrisic's performance of the library are shown to the users.
</p>
<p>
Two examples of Metis/ParMetis input can be access through the main windows of Partify. The graph is composed of 766 nodes and 1314 edges whereas the mesh is made of a 3D region, using tetrahedral elements.
</p>
<p>Take a look at the mesh and graph file example provide within the software in order to see how it is wrote (tet.mesh and graph.txt)</p>


## Installation

1. Install node.js globally.
2. Clone the repository :

  `git clone https://github.com/bnogaret/graph-partitioning.git`
  
3. Execute:

  `npm install`

4. Install the parmetis and metis (mpmetis and gpmetis) executable in a directory named native. If you are on linux, install chaco too.
5. To start:

  `npm start`
  

