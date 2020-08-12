var draw = (function() {

  //Get the height and width of the main we will use this set canvas to the full
  //size of the main element.
  var mWidth = document.querySelector('main').offsetWidth,
    mHeight = document.querySelector('main').offsetHeight,

    //Create the canvas
    canvas = document.createElement("canvas"),

    //Create the context
    ctx = canvas.getContext("2d"),

    //Create the initial bounding rectangle
    rect = canvas.getBoundingClientRect(),

    //current x,y position
    x=0,
    y=0;

  //starting x,y
  x1=0,
  y1=0,

  //ending x,y
  x2=0,
  y2=0;

  //Tracks the last x,y state
  lx = false,
  ly = false,

  //What shape are we drawing?
  shape='';

  //Do we want to draw?
  isDrawing=false;

  //stroke color
  var stroke='';

  //fill color
  var fill='';

  //Draw 3-point Triangle
  var points = [];
  var i = 0;

  return {
      //Set the x,y coords based on current event data
      setXY: function(evt) {

          //Track the last x,y position before setting the current position.
          lx=x;
          ly=y;
      
          //Set the current x,y position
          x = (evt.clientX - rect.left) - canvas.offsetLeft;
          y = (evt.clientY - rect.top) - canvas.offsetTop;
      },
  
    //Write the x,y coods to the target div
    writeXY: function() {
      document.getElementById('trackX').innerHTML = 'X: ' + x;
      document.getElementById('trackY').innerHTML = 'Y: ' + y;
    },

    setStart: function() {
      x1=x;
      y1=y;
    },
    
    setEnd: function() {
      x2=x;
      y2=y;
    },

  //Draw 3-point Triangle
  setPoint: function(){

      points[i]=[];
      points[i]['x']=x;
      points[i]['y']=y;

      if(points.length>2){
          this.draw();
          i=0;
          points=[];
      }else{
          i++;
      }        
  },
    
    //Sets the shape to be drawn
    setShape: function(shp) {
      shape = shp;
    },

    //Set a random color
    randColor: function(){
      return '#' + Math.floor(Math.random()*16777215).toString(16);
    },

    //A setter for stroke
    setStrokeColor: function(color){
    stroke = color;
    },

    //A getter for stroke
    getStrokeColor: function(){
      if(stroke.length > 6){
      return stroke;
      }
      return this.randColor();
    },

    //A setter for fill
    setFillColor: function(color){
      fill = color;
    },

    //A getter for fill
    getFillColor: function(){
      if(fill.length > 6){
      return fill;
      }
      return this.randColor();
    },
  
    setIsDrawing: function(bool) {
    isDrawing = bool;
    },
    
    getIsDrawing: function() {
      return isDrawing;
    },
    
    draw: function() {
      ctx.restore();
      if(shape==='rectangle')
      {
        this.drawRect();
      } else if(shape==='line') {
        this.drawLine();
      } else if(shape==='circle') {
        this.drawCircle();
      } else if(shape==='path') {
        this.drawPath();
      } else if(shape==='triangle') {
          this.drawTriangle();
      } else if(shape==='3-point') {
          this.draw3Point();
      } else {
      alert('Please choose a shape');
      }
      ctx.save();
    },

      //Draw a rectangle
      // drawRect: function(x,y,h,w) {
      drawRect: function(){
      ctx.strokeStyle = this.getStrokeColor();
      //Start by using random fill colors.
      ctx.fillStyle = this.getFillColor();
      // ctx.fillStyle = '#'+Math.floor(Math.random()*16777215).toString(16);      
      ctx.fillRect (x1,y1,(x2-x1),(y2-y1));
      ctx.stroke();
    },

      //Draw a line
      drawLine: function() {
      //Start by using random fill colors.
      // ctx.strokeStyle = '#'+Math.floor(Math.random()*16777215).toString(16);
      ctx.strokeStyle = this.getStrokeColor();
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    },

      //Draw a circle
      drawCircle: function() {
          ctx.strokeStyle = this.getStrokeColor();
          // ctx.strokeStyle = '#'+Math.floor(Math.random()*16777215).toString(16);
          ctx.fillStyle = this.getFillColor();
          // ctx.fillStyle = '#'+Math.floor(Math.random()*16777215).toString(16);
      
          let a = (x1-x2)
          let b = (y1-y2)
          let radius = Math.sqrt( a*a + b*b );
      
          ctx.beginPath();
          ctx.arc(x1, y1, radius, 0, 2*Math.PI);
          ctx.stroke();
          ctx.fill();
      },

      //Draw a path
      drawPath: function() {
          //Start by using random fill colors.
          ctx.strokeStyle = this.getStrokeColor();
          // ctx.strokeStyle = '#'+Math.floor(Math.random()*16777215).toString(16);
          ctx.beginPath();
          ctx.moveTo(lx, ly);
          ctx.lineTo(x, y);
          ctx.stroke();
      },

    //Draw a triangle
    drawTriangle: function(){

      //x1,y1 to x2,y2 is the first line we will use the first point +/- 
      //(depending on the direction of the mouse movement) the result of 
      //PT to add a third point. 
      var a = (x1-x2);
      var b = (y1-y2);
      var c = Math.sqrt(a*a + b*b);

      var d = x1+c;
      var e = y1+c;

      //Drag left to right
      if(x1>x2){
          d=x1-c;
      }

      //Drag up
      if(y1>y2){
          e=y1-c;
      }
  
      ctx.fillStyle = this.getFillColor();
      ctx.strokeStyle = this.getStrokeColor();
      ctx.beginPath();
      ctx.moveTo(x1, y1);

      ctx.lineTo(d,e);
      ctx.lineTo(x2, y2);

      ctx.lineTo(x1, y1);
      ctx.stroke();
      ctx.fill();
  },

      //Draw 3-point Triangle
      draw3Point: function(){

      ctx.fillStyle = this.getFillColor();
      ctx.strokeStyle = this.getStrokeColor();

      ctx.beginPath();

      ctx.moveTo(points[0]['x'], points[0]['y']);
      ctx.lineTo(points[1]['x'], points[1]['y']);
      ctx.lineTo(points[2]['x'], points[2]['y']);
      ctx.lineTo(points[0]['x'], points[0]['y']);

      ctx.stroke();
      ctx.fill();
  },

      getShape: function() {
      return shape;
      },
                
      getCanvas: function(){
          return canvas;
      },

   


    //Initialize the object, this must be called before anything else
    init: function() {
      canvas.width = mWidth;
      canvas.height = mHeight;
      document.querySelector('main').appendChild(canvas);

    }
  };

})();

//Initialize draw
draw.init();

  document.getElementById('btnRect').addEventListener('click',function(){
  draw.setShape('rectangle');
  }, false);

  document.getElementById('btnLine').addEventListener('click',function(){
      draw.setShape('line');
  }, false);

  document.getElementById('btnCircle').addEventListener('click',function(){
      draw.setShape('circle');
  }, false);

  document.getElementById('btnPath').addEventListener('click',function(){
      draw.setShape('path');
  }, false);

  document.getElementById('btnTriangle').addEventListener('click',function(){
      draw.setShape('triangle');
  }, false);

  document.getElementById('btn3Point').addEventListener('click', function(){
      draw.setShape('3-point');
    });
    
//Add a mousemove listener to the canvas
//When the mouse reports a change of position use the event data to
//set and report the x,y position on the mouse.
draw.getCanvas().addEventListener('mousemove', function(evt) {
  draw.setXY(evt);
  draw.writeXY();
  if(draw.getShape()=='path' && draw.getIsDrawing()===true) {
    draw.draw();
  }
}, false);
    
//Set the starting position
draw.getCanvas().addEventListener('mousedown', function() {
  //Draw 3-point Triangle
  if(draw.getShape()!=='3-point'){
  draw.setStart();
  draw.setIsDrawing(true);
  }
}, false);

draw.getCanvas().addEventListener('mouseup', function() {
  //Draw 3-point Triangle
  if(draw.getShape()!=='3-point'){
  draw.setEnd();
  draw.draw();
  draw.setIsDrawing(false);
  }
  //Draw 3-point Triangle
  if(draw.getShape()==='3-point'){
  draw.setPoint();
  }  
}, false);

document.getElementById('strokeColor').addEventListener('change', function(){
  draw.setStrokeColor(document.getElementById('strokeColor').value);
});

document.getElementById('randStrokeColor').addEventListener('change', function(){
draw.setStrokeColor('');
});

document.getElementById('fillColor').addEventListener('change', function(){
draw.setFillColor(document.getElementById('fillColor').value);
});
  
document.getElementById('randFillColor').addEventListener('change', function(){
draw.setFillColor('');
});
    