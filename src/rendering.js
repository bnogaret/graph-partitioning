const fs = require('fs');
var App = {};
App.fileInput = '4elt.graph';
App.fileOutput = '4elt.graph.part.4';


const Viva = require('../libs/vivagraph.min.js');
	



function onLoad() {
    App.graphGenerator = Viva.Graph.generator();
    App.graph = App.graphGenerator.grid(50, 10);
    App.layout = Viva.Graph.Layout.forceDirected(App.graph);
    App.graphics = Viva.Graph.View.webglGraphics();
    App.renderer = Viva.Graph.View.renderer(App.graph, {
      layout: App.layout,
      graphics: App.graphics,
      container: document.getElementById('graph-container')
    });
      
      
        
            //Step 1. Get the library to read and draw
            
            var contents = fs.readFileSync(App.fileInput, 'utf-8');
            var graph = App.graph;

            //Step 2. Each value of the array correspond to one line             
            var contentsByLine = contents.split('\n');

            //Step 3. Get the number of nodes (first value first line)
            // And the others parameters (number of edges(we don't use it in our case), fmt, ncon)
            //Thanks to the the same algorithm has step 4.

            function getInteger (target) 
            {
                var first_line = [];
                var temp = [];                
                var out_firstline = parseInt(target);
                var nl_first_line = target;

                while (out_firstline) 
                {
                    first_line.push(out_firstline);
                    temp = nl_first_line.replace(out_firstline, '');
                    nl_first_line = temp;
                    out_firstline = parseInt(nl_first_line);        
                }
                
                return first_line;
            }
            
        var first_line = getInteger(contentsByLine[0]);
        
            function get_fmt_ncon (numberOfNodes, numberOfEdges, contentsByline) 
            {
                var fmt_ncon =[];
                //Get only fmt and ncon
                var nl_first_line = contentsByLine[0];             
                var temp  = [];
                
                    temp = nl_first_line.replace(numberOfNodes, '');
                    nl_first_line = temp;
                    temp = nl_first_line.replace(numberOfEdges, '');
                    //suppress all blank space
                    nl_first_line = temp.replace(/ /g,'');

                return nl_first_line;
            }
        
        switch (first_line.length) 
        {
            case 1:
                var numberOfNodes = first_line[0];
                n_render();
                    break;
            case 2:                
                var numberOfNodes = first_line[0];
                var numberOfEdges = first_line[1];
                    n_render();
                    break;
            case 3:
                var numberOfNodes = first_line[0];
                var numberOfEdges = first_line[1];
                
                var fmt_ncon = get_fmt_ncon(numberOfNodes, numberOfEdges, contentsByLine[0]); //<!--blank space at the end-->
                
                if (fmt_ncon.length === 4) 
                {//<!--blank space at the end-->

                    var fmt = fmt_ncon;
                    fmt_render();
                    
                } else 
                {
                    var fmt = [];                    
                    var ncon = [];
                    
                    for(var i = 0; i < 3; i++)
                        fmt.push(fmt_ncon[i]);
                    
                    for(var i = 3; i < fmt_ncon.length - 1; i++)
                        ncon.push(fmt_ncon[i]);
                                        
                    fmt_ncon_render();
                }
                    break;
        }
        
        App.numberOfNodes = numberOfNodes;
      
        //Step 4. Get the links for each lines
            // As there are blank space and integer we catch first integer
            //remove it from the line and catch the other one and remove it
            //and so on...
            //And then draw them for each lines
        
      //First and Second case of the switch (numbers of nodes, numbers of edges)   
      function n_render () 
        {
        
                for (var i = 1; i < numberOfNodes + 1; i++)
                {
                    var nl_byLine   = contentsByLine[i];
                    var out         = parseInt(nl_byLine);

                        while (out)
                        {                        
                            graph.addLink(i, out);
                            var temp = nl_byLine.replace(out, '');
                            nl_byLine = temp;
                            out = parseInt(nl_byLine);                        
                        }       
                }                
        }
        
        //Last case of the switch with only fmt
        //<!-- undefined links[links.length - 1] --> 
        function fmt_render ()
        {
            
            console.log('fmt_render');
            
                //Links the last values is undefined
                //Handle weight equal to 0 
                var links       = [];
                var nl_byLine   = [];
                var out         = 1;
                var zero_case   = 0;
                var temp        = [];

                for (var i = 1; i < numberOfNodes + 1; i++)
                {
                    nl_byLine = contentsByLine[i];
                    links = [];
                    out = 1;

                    while(out)
                    {
                        out = parseInt(nl_byLine);
                        //prevent from quitting the loop in case out === 0
                        if(out === 0)
                        {
                            links.push(0);
                            temp = nl_byLine.replace(out, '');              
                            nl_byLine = temp;                    
                            out = 1;                  
                        }else
                        {
                            links.push(out);
                            temp = nl_byLine.replace(out, '');
                            nl_byLine = temp;
                        }      
                    }  

                    //Drawing part
                    //case fmt = 001 
                    //edges weight links[j+1]
                    if (fmt[0] === '0' && fmt[1] === '0' && fmt[2] === '1') 
                    {
                        for (var j = 0; j < links.length - 2; j++) 
                        {                      
                                if (j%2 === 0)//first values is the edges and second is the weight of the edge 
                                {
                                    graph.addLink(i, links[j]);
                                    console.log('weight edges 001: ' + links[j+1]);
                                }                                
                        }
                    }
                    //case fmt = 101 
                    //edges weight links[j+1]
                    //links[0] = size of the nodes
                    if (fmt[0] === '1' && fmt[1] === '0' && fmt[2] === '1') 
                    {
                        for (var j = 1; j < links.length - 2; j++) 
                        {                      
                                if (j%2 === 0)//first values is the edges and second is the weight of the edge 
                                {
                                    graph.addLink(i, links[j]);
                                    console.log('weight edges 001: ' + links[j+1]);
                                }                                
                        }
                    }
                    
                    
                    
                    //case fmt = 011                
                    //nodes weigth links[0]
                    //edges weight links[j+1]                     
                    if ( fmt[0] === '0' && fmt[1] === '1' && fmt[2] === '1') 
                    {
                        for (var j = 1; j < links.length - 2; j++) 
                        {                            
                                if (j%2 === 1)//first values is the edges and second is the weight of the edge 
                                {
                                    graph.addLink(i, links[j]);
                                    console.log('weight edges 011:' + links[j+1]);
                                }                                
                        }                            
                    }
                    
                    //case fmt = 111
                    //nodes size links[0]
                    //nodes weigth links[1]
                    //edges weight links[j+1]   
                    if ( fmt[0] === '1' && fmt[1] === '1' && fmt[2] === '1') 
                    {
                        for (var j = 2; j < links.length - 2; j++) 
                        {                            
                                if (j%2 === 1)//first values is the edges and second is the weight of the edge 
                                {
                                    graph.addLink(i, links[j]);
                                    console.log('weight edges 011:' + links[j+1]);
                                }                                
                        }                            
                    }
                    
                    //case fmt = 010
                    //nodes weigth links[0]   
                    if (fmt[0] === '0' && fmt[1] === '1' && fmt[2] === '0') 
                    {                            
                        for (var j = 1; j < links.length - 1; j++) 
                        {                            
                                    graph.addLink(i, links[j]);
                                    console.log('weight vertices 010:' + links[0]);
                        }                                
                    }
                    
                    //case fmt = 110
                    //nodes size    links[0]
                    //nodes weigth  links[1]
                    //edges weight  links[j+1]   
                    if (fmt[0] === '1' && fmt[1] === '1' && fmt[2] === '0') 
                    {                            
                        for (var j = 1; j < links.length - 1; j++) 
                        {                            
                                    graph.addLink(i, links[j]);
                                    console.log('weight vertices 010:' + links[0]);
                        }                                
                    }  
                }  
            }

        //Last case of the switch with fmt and ncon
        //<!--undefined links[links.length - 1] --> 
        function fmt_ncon_render () 
        {
            
            //Links the last values is undefined
                //Handle weight equal to 0 
                var links       = [];
                var nl_byLine   = [];
                var out         = 1;
                var zero_case   = 0;
                var temp        = [];
                var ncon_int    = parseInt(ncon);
            
                for (var i = 1; i < numberOfNodes + 1; i++)
                {
                    nl_byLine = contentsByLine[i];
                    links = [];
                    out = 1;

                    while(out)
                    {
                        out = parseInt(nl_byLine);
                        //prevent from quitting the loop in case out === 0
                        if(out === 0)
                        {
                            links.push(0);
                            temp = nl_byLine.replace(out, '');              
                            nl_byLine = temp;                    
                            out = 1;                  
                        }else
                        {
                            links.push(out);
                            temp = nl_byLine.replace(out, '');
                            nl_byLine = temp;
                        }      
                    }
                    
                
                    
                        //Drawing part
                        //<!-- if ncon = 0 -> undefined every case works except when the first ncon is equal to 0 -->
                        //case fmt = 010
                        //weight of the vertices = [0..ncon[0]]                          
                        if (fmt[0] === '0' && fmt[1] === '1' && fmt[2] === '0')
                        {                            
                             //weight of the vertice
                            for(var j = 0; j < ncon_int; j++)                                
                                console.log('node: ' + i + ' ncons: ' + links[j]); 
                                                                                                                        
                            for (var j = ncon_int; j < links.length - 1; j++)                     
                                console.log('edge: ' + links[j]);   
                        }
                    
                        //case fmt = 110
                        //nodes size links[0]
                        //weight of the vertices = [1..ncon[0]]                          
                        if (fmt[0] === '1' && fmt[1] === '1' && fmt[2] === '0')
                        {                            
                             //weight of the vertice
                            for(var j = 1; j < ncon_int + 1; j++)                                
                                console.log('node: ' + i + ' ncons: ' + links[j]); 
                                                                                                                        
                            for (var j = ncon_int + 1; j < links.length - 1; j++)                     
                                console.log('edge: ' + links[j]);   
                        }
                    
                        //case fmt = 011
                        //weight of the vertices = [0..ncon[0]]                    
                        
                        //ncon%2 = 0                    
                        if (fmt[0] === '0' && fmt[1] === '1' && fmt[2] === '1')
                        {
                            
                            //weight of the vertice
                            for(var j = 0; j < ncon_int; j++)  
                                console.log('node: ' + i + ' ncon: ' + links[j]);  
                            
                            if(ncon_int%2 === 0)
                            {    
                                for (var j = ncon_int; j < links.length - 2; j++)
                                {         
                                    if(j%2 === 0)
                                    {
                                        graph.addLink(i, links[j]);
                                        console.log('weight edge: ' + links[j+1]);
                                    }                                   
                                } 
                            }
                            
                        //ncon%2 = 1
                            if(ncon_int%2 === 1)
                            {  
                                for (var j = ncon_int; j < links.length - 2; j++)
                                {
                                    if(j%2 === 1)
                                    {
                                        graph.addLink(i, links[j]);
                                        console.log('weight edges: ' + links[j+1]);
                                    }                                    
                                }
                            }                                    
                        }
                        //case fmt = 111
                        //nodes size links[0]
                        //weight of the vertices = [0..ncon[0]]                      
                        //ncon%2 = 0                    
                        if (fmt[0] === '1' && fmt[1] === '1' && fmt[2] === '1')
                        {
                            
                            //weight of the vertice
                            for (var j = 1; j < ncon_int + 1; j++)  
                                console.log('node: ' + i + ' ncon: ' + links[j]);  
                            
                            if(ncon_int%2 === 0)
                            {    
                                for (var j = ncon_int + 1; j < links.length - 2; j++)
                                {         
                                    if(j%2 === 0)
                                    {
                                        graph.addLink(i, links[j]);
                                        console.log('weight edge: ' + links[j+1]);
                                    }                                   
                                } 
                            }
                            
                        //ncon%2 = 1
                            if(ncon_int%2 === 1)
                            {  
                                for (var j = ncon_int + 1; j < links.length - 2; j++)
                                {
                                    if(j%2 === 1)
                                    {
                                        graph.addLink(i, links[j]);
                                        console.log('weight edges: ' + links[j+1]);
                                    }                                    
                                }
                            }                                    
                        } 
                }
            }
        
                // Step 5. Render the graph
                
                

                App.layout =  Viva.Graph.Layout.forceDirected(graph, {
                        springLength : 50, //10
                        springCoeff : 0.0008,//0.0005,
                        dragCoeff : 0.01,
                        gravity : -5.20,
                        theta : 1,
						timestep : 1
                    });

                App.renderer = Viva.Graph.View.renderer(graph,
                {
                        graphics : App.graphics,
                        layout : App.layout,
                        interactive :  'drag, scroll',
                        renderLinks: false
                });
        
                App.renderer.run();
                App.renderer.pause();
                addColor(numberOfNodes);
  }

function addColor(numberOfNodes)
{
    // Step 6. Colors
                //Colors up until (20 processors for more add more colors)        
                var colors = [
                                0x1f77b4ff, 0xaec7e8ff,
                                0xff7f0eff, 0xffbb78ff,
                                0x2ca02cff, 0x98df8aff,
                                0xd62728ff, 0xff9896ff,
                                0x9467bdff, 0xc5b0d5ff,
                                0x8c564bff, 0xc49c94ff,
                                0xe377c2ff, 0xf7b6d2ff,
                                0x7f7f7fff, 0xc7c7c7ff,
                                0xbcbd22ff, 0xdbdb8dff,
                                0x17becfff, 0x9edae5ff
                                                        ];
                //Read output file from metis
            
                var output = App.fileOutput;
                
                function addColors (link)
                {
                    var outputs = fs.readFileSync(link, 'utf-8');
                    var processors = outputs.split('\n');
                                       
                    for (var i = 1; i < numberOfNodes + 1; i++)          
                        App.graphics.getNodeUI(i).color = colors[parseInt(processors[i-1])];

                }
                
                addColors(output);        
                
            App.renderer.rerender();
                
}
                

  function loadNew() {
    App.renderer.dispose();
	App.renderer = null;
   App.renderer = Viva.Graph.View.renderer(App.graph,
                {
                        graphics : App.graphics,
                        layout : App.layout,
                        interactive : 'drag, scroll',
                        renderLinks: true
                });
  
  
  App.renderer.run();


  //App.renderer.pause();
  //addColor(App.numberOfNodes);
	 
	  
	  /*var g = App.renderer.getGraphics();

	  g.renderLinks = true;*/
	  
	  
	  

    
  }

    /*var addLinks = document.getElementById('loadNew');
    
    addLinks.addEventListener('click', function(){
        loadNew();
    });*/
module.exports.onLoad = onLoad;

