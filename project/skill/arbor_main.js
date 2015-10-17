/*
 * arbor_main.js
 * author: tiankonguse
 * email: i@tiankonguse.com
 */

(function($){

  var Renderer = function(canvas){
    var canvas = $(canvas).get(0),
        ctx = canvas.getContext("2d"),
        particleSystem;
    var gfx = arbor.Graphics(canvas);

    // helpers for figuring out where to draw arrows (thanks springy.js)
    var intersect_line_line = function(p1, p2, p3, p4)
    {
      var denom = ((p4.y - p3.y)*(p2.x - p1.x) - (p4.x - p3.x)*(p2.y - p1.y));
      if (denom === 0) return false // lines are parallel
      var ua = ((p4.x - p3.x)*(p1.y - p3.y) - (p4.y - p3.y)*(p1.x - p3.x)) / denom;
      var ub = ((p2.x - p1.x)*(p1.y - p3.y) - (p2.y - p1.y)*(p1.x - p3.x)) / denom;

      if (ua < 0 || ua > 1 || ub < 0 || ub > 1)  return false
      return arbor.Point(p1.x + ua * (p2.x - p1.x), p1.y + ua * (p2.y - p1.y));
    }

    var intersect_line_box = function(p1, p2, boxTuple)
    {
      var p3 = {x:boxTuple[0], y:boxTuple[1]},
          w = boxTuple[2],
          h = boxTuple[3]
      
      var tl = {x: p3.x, y: p3.y};
      var tr = {x: p3.x + w, y: p3.y};
      var bl = {x: p3.x, y: p3.y + h};
      var br = {x: p3.x + w, y: p3.y + h};

      return intersect_line_line(p1, p2, tl, tr) ||
             intersect_line_line(p1, p2, tr, br) ||
             intersect_line_line(p1, p2, br, bl) ||
             intersect_line_line(p1, p2, bl, tl) ||
             false
    }
    console.log(canvas.width, canvas.height);

    var that = {
      init:function(system){
        particleSystem = system;
        particleSystem.screenSize(canvas.width, canvas.height);
        particleSystem.screenPadding(20);
        that.initMouseHandling();
      },
      
      redraw:function(){
        // 
        // redraw will be called repeatedly during the run whenever the node positions
        // change. the new positions for the nodes can be accessed by looking at the
        // .p attribute of a given node. however the p.x & p.y values are in the coordinates
        // of the particle system rather than the screen. you can either map them to
        // the screen yourself, or use the convenience iterators .eachNode (and .eachEdge)
        // which allow you to step through the actual node objects but also pass an
        // x,y point in the screen's coordinate system
        // 
        if (!particleSystem) return
                
        ctx.clearRect(0,0, canvas.width, canvas.height)

        var nodeBoxes = {}
        particleSystem.eachNode(function(node, pt){
          // node: {mass:#, p:{x,y}, name:"", data:{}}
          // pt:   {x:#, y:#}  node position in screen coords
          

          // determine the box size and round off the coords if we'll be 
          // drawing a text label (awful alignment jitter otherwise...)
          var label = (node.data.description || "").toString();
          var w, h, fontsize;
          switch (node.data.style) {
            case 'biggest':
              ctx.font = "24px Avenir";
              w = ctx.measureText(label).width + 10;
              h = 36;
              fontsize = "24px";
              break;
            case 'bigger':
              ctx.font = "20px Avenir";
              w = ctx.measureText(label).width + 10;
              h = 28;
              fontsize = "20px";
              break;
            default:
              ctx.font = "14px Avenir";
              w = ctx.measureText(label).width + 10;
              h = 20;
              fontsize = "14px";
              break;
          }
          if (!(label).match(/^[\t]*$/)){
            pt.x = Math.floor(pt.x);
            pt.y = Math.floor(pt.y);
          }else{
            label = null;
          }

          if (!node.data.color) {
            switch (node.data.type) {
              case 'lang':
                ctx.fillStyle = '#4F94CD';
                break;
              case 'tool':
                ctx.fillStyle = '#FF6A6A';
                break;
              case 'experience':
                ctx.fillStyle = '#EEB422';
                break;
              default:
                ctx.fillStyle = '#333333';
                break;
            }
          } else {
            ctx.fillStyle = node.data.color;
          }
          
          gfx.rect(pt.x-w/2, pt.y-h/2, w, h, 4, {fill:ctx.fillStyle});
          nodeBoxes[node.name] = [pt.x-w/2, pt.y-h/2-1, w, h+2];

          // draw the text
          if (label){
            ctx.font = fontsize + " Avenir, Microsoft Yahei, Hiragino Sans GB, Microsoft Sans Serif, WenQuanYi Micro Hei, sans-serif";
            ctx.textAlign = "center";
            ctx.fillStyle = "white";
            ctx.fillText(label||"", pt.x, pt.y+4);
            ctx.fillText(label||"", pt.x, pt.y+4);
          }
        })          


        ctx.strokeStyle = "#cccccc";
        ctx.lineWidth = 1;
        ctx.beginPath();
        particleSystem.eachEdge(function(edge, pt1, pt2){
          // edge: {source:Node, target:Node, length:#, data:{}}
          // pt1:  {x:#, y:#}  source position in screen coords
          // pt2:  {x:#, y:#}  target position in screen coords

          var weight = 1;//edge.data.weight;
          var color = edge.data.color;
          
          // trace(color)
          if (!color || (""+color).match(/^[ \t]*$/)) color = null;

          // find the start point
          var tail = intersect_line_box(pt1, pt2, nodeBoxes[edge.source.name]);
          var head = intersect_line_box(tail, pt2, nodeBoxes[edge.target.name]);

          ctx.save();
            ctx.beginPath();

            if (!isNaN(weight)) ctx.lineWidth = weight;
            if (color) ctx.strokeStyle = color;
            // if (color) trace(color)
            ctx.fillStyle = null;
          
            ctx.moveTo(tail.x, tail.y);
            ctx.lineTo(head.x, head.y);
            ctx.stroke();
          ctx.restore();
          
          // draw an arrowhead if this is a -> style edge
          if (edge.data.directed){
            ctx.save();
              // move to the head position of the edge we just drew
              var wt = !isNaN(weight) ? parseFloat(weight) : ctx.lineWidth;
              var arrowLength = 6 + wt;
              var arrowWidth = 2 + wt;
              ctx.fillStyle = (color) ? color : ctx.strokeStyle;
              ctx.translate(head.x, head.y);
              ctx.rotate(Math.atan2(head.y - tail.y, head.x - tail.x));

              // delete some of the edge that's already there (so the point isn't hidden)
              ctx.clearRect(-arrowLength/2,-wt/2, arrowLength/2,wt)

              // draw the chevron
              ctx.beginPath();
              ctx.moveTo(-arrowLength, arrowWidth);
              ctx.lineTo(0, 0);
              ctx.lineTo(-arrowLength, -arrowWidth);
              ctx.lineTo(-arrowLength * 0.8, -0);
              ctx.closePath();
              ctx.fill();
            ctx.restore();
          }
        })			
      },
      
      initMouseHandling:function(){
        // no-nonsense drag and drop (thanks springy.js)
        var dragged = null;

        // set up a handler object that will initially listen for mousedowns then
        // for moves and mouseups while dragging
        var handler = {
          clicked:function(e){
            var pos = $(canvas).offset();
            _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)
            dragged = particleSystem.nearest(_mouseP);

            if (dragged && dragged.node !== null){
              // while we're dragging, don't let physics move the node
              dragged.node.fixed = true
            }

            $(canvas).bind('mousemove', handler.dragged)
            $(canvas).bind('touchmove', handler.dragged)
            $(window).bind('mouseup', handler.dropped)
            $(window).bind('touchend', handler.dropped)

            return false
          },
          dragged:function(e){
            var pos = $(canvas).offset();
            var s = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)

            if (dragged && dragged.node !== null){
              var p = particleSystem.fromScreen(s)
              dragged.node.p = p
            }

            return false
          },

          dropped:function(e){
            if (dragged===null || dragged.node===undefined) return
            if (dragged.node !== null) dragged.node.fixed = false
            dragged.node.tempMass = 1000
            dragged = null
            $(canvas).unbind('mousemove', handler.dragged)
            $(canvas).unbind('touchmove', handler.dragged)
            $(window).unbind('mouseup', handler.dropped)
            $(window).unbind('touchend', handler.dropped)
            _mouseP = null
            return false
          }
        }
        
        // start listening
        $(canvas).mousedown(handler.clicked);
        $(canvas).bind("touchstart", handler.clicked);

      },
      
    }
    return that
  }    

  $(document).ready(function(){


    // add some nodes to the graph and watch it go...
    //sys.addEdge('a','b')
    //sys.addEdge('a','c')
    //sys.addEdge('a','d')
    //sys.addEdge('a','e')
    //sys.addNode('f', {alone:true, mass:.25})

    // or, equivalently:
    //
    
    $.get("/data/arbor-data.json", function(data){
        var w = 950;
        var h = 450;
        if(tk.isMobile.any()){
            $("#skillboard-msg").text("不支持移动端");
            return;
        }
        $("#skillboard").attr("width", w-10).attr("height" , h-10);
        
        console.log(w,h);
        var sys = arbor.ParticleSystem(1000, 800, 0.5) // create the system with sensible repulsion/stiffness/friction
        sys.parameters({gravity:true}) // use center-gravity to make the graph settle nicely (ymmv)
        sys.renderer = Renderer("#skillboard") // our newly created renderer will have its .init() method called shortly by sys...
    
        var nodes = {};
        var edges = {};
        var node, item, use, edge, edgeNode;
        
        
        
        for(var i in data){
            item = data[i];
            node = {description: item.name, type: 'experience'};
            node.weight = item.use.length;
            nodes[item.name] = node;
            
            edge = {};
            for(var j in item.use){
                use = item.use[j];
                
                edgeNode = nodes[use] || {description: use, type: 'tool', weight : 0};
                edgeNode.weight++;
                
                nodes[use] = edgeNode;
                edge[use] = {weight : 1};
            }
            edges[item.name] = edge;
            
        }
        
        // select 3 nodes with the most weight.
        var max3 = [];
        for (var n in nodes) {
          if (nodes.hasOwnProperty(n)) {
            nodes[n].weight || (nodes[n].weight = 0);
            max3.push(nodes[n]);
          }
        }
        max3.sort(function(a, b){
          return b.weight - a.weight;
        });
        max3[0].style = "biggest";
        max3[1].style = "bigger";
        max3[2].style = "bigger";

        sys.graft({
          nodes: nodes,
          edges: edges
        })
        
    });

  })

})(this.jQuery)
