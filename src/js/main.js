var draw = (function() {

  //Get the height and width of the main we will use this set canvas to the full
  //size of the main element.
  var 
    mWidth = document.querySelector('main').offsetWidth,
    mHeight = document.querySelector('main').offsetHeight,
    // mWidthx = $('main').offsetWidth,
    // mHeightx = $('main').offsetHeight,

    //Create the canvas
    canvas = document.createElement('canvas'),

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
    y2=0,

    //Tracks the last x,y state
    lx = false,
    ly = false,

    // save whether in drawing process
    isDrawing = false,

    // Width of the pen for lines
    penWidth = 3,

    // When mouse down = true
    //  mouse up = false
    mouseDown = false;

    // If color is random - set a random for the fill and stroke
    colorSw = true;

    //What shape are we drawing?
    shape ='';

    //3 point variables
    var points = [];
    var i = 0;


  return {

    setStart: function() {
      x1=x;
      y1=y;
    },
    
    setEnd: function() {
      x2=x;
      y2=y;
    },

    //Draw a three point triangle
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

    //Set the x,y coords based on current event data
    setXY: function(evt) {

      //Track the last x,y position before setting the current position.
      lx=x;
      ly=y;

      x = (evt.clientX - rect.left) - canvas.offsetLeft;
      y = (evt.clientY - rect.top) - canvas.offsetTop;
    },

    //Write the x,y coods to the target div
    writeXY: function() {
      $('#trackX').text('X: ' + x);
      $('#trackY').text('Y: ' + y);
    },

    getCanvas: function(){
      return canvas;
    },

    //Sets the shape to be drawn
    setShape: function(shp) {
        shape = shp;
    },
    getShape: function() {
      return shape;
    },
    setColorSw: function( tOrF ){
      colorSw = tOrF;
    },
    getColorSw: function( ){
      return colorSw;
    },


    //Draws the selected shape
    draw: function() {

        ctx.restore();

        ctx.lineWidth = penWidth;
        if(shape==='rectangle')
        {
          this.drawRect();
          
        } else if( shape==='line' ) {
          
          this.drawLine();

        } else if( shape==='triangle' ) {
          this.drawTriangle();

        } else if( shape==='3-point' ) {
          this.draw3Point();

        } else if( shape==='isos' ) {
          this.drawIsos();

        } else if( shape==='circle' ) {
          this.drawCircle();

        } else if( shape==='path' ) {
          this.drawPath();
        
        } else {
          alert('Please choose a shape');
        }
        ctx.save();
    },  // end draw funciton

    setColor: function() {
      if (this.getColorSw() === true){
        ctx.strokeStyle = '#'+Math.floor(Math.random()*16777215).toString(16);
        ctx.fillStyle = ctx.strokeStyle; 
      }
      else {
        ctx.strokeStyle = document.getElementById('shapeColor').value;
        ctx.fillStyle = document.getElementById('shapeColor').value;
      }
    },

    //Draw a circle
    drawCircle: function() {
      this.setColor();
      let a = (x1-x2)
      let b = (y1-y2)
      let radius = Math.sqrt( a*a + b*b );

      ctx.beginPath();
      ctx.arc(x1, y1, radius, 0, 2*Math.PI);
      ctx.stroke();
      ctx.fill();
    },


    //Draw a line
    drawLine: function() {
      this.setColor();
   
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    },

    //Draw a rectangle
    drawRect: function() {
      this.setColor();

      ctx.fillRect (x1,y1,(x2-x1),(y2-y1));
    },

    getCanvas: function(){
      return canvas;
    },

    drawTriangle: function(){
      this.setColor();
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x1, y2);
      ctx.fill();
    },

    //Draw a 3-point triangle
    draw3Point: function(){
      this.setColor();
      ctx.beginPath();

      ctx.moveTo(points[0]['x'], points[0]['y']);
      ctx.lineTo(points[1]['x'], points[1]['y']);
      ctx.lineTo(points[2]['x'], points[2]['y']);
      ctx.lineTo(points[0]['x'], points[0]['y']);

      // ctx.stroke();
      ctx.fill();
    },      

    drawIsos: function(){
      this.setColor();

      ctx.strokeStyle = document.getElementById('shapeColor').value;
      ctx.fillStyle = document.getElementById('shapeColor').value;
      ctx.beginPath();
      if ( x2 > x1){
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.lineTo(x2+Math.abs(x2-x1), y1);
      }
      else{
          ctx.moveTo(x1,y1);
          ctx.lineTo(x2,y2);
          ctx.lineTo(x2,y2+2*Math.abs(y1-y2));
      }
      ctx.fill(); 
    },

    drawPath: function(){
      this.setColor();
      if (mouseDown === true){

      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.lineTo(x, y);
      ctx.stroke();
      }
    },


    //Initialize the object, this must be called before anything else
    init: function() {
      canvas.width = mWidth;
      canvas.height = mHeight;
      document.querySelector('main').appendChild(canvas);
      $('#trackX').text('X: ');
      $('#trackY').text('Y: ');
      $('#selShape').text('No Shape Selected');
      mouseDown = false;  
    },

    // Reset the canvas object 
    resetCanvas: function() {
    if (confirm('Do You really want to clear Your canvas?') == true ){
        lx=0;
        ly=0;
        x = 0;
        y = 0;
        mouseDown = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    },


    // Prompt user for pen width within in a set boundary 
    //  save it and display it.
    lineWidth: function() {
      var lW = prompt('Enter a number from 1 to 30\nto set the width of the line ');
      if (lW >= 1 && lW <= 30 ){
          penWidth = lW;
          $('#btnLineWidth').text('Width = ' + penWidth);
      }
      },

    setIsDrawing: function(bool) {
      isDrawing = bool;
    },
    
    getIsDrawing: function() {
      return isDrawing;
    },

    setMouseDown: function( bool ){
      mouseDown = bool;
    }

  };

})();

//Initialize draw
draw.init();

//Add a mousemove listener to the canvas
//When the mouse reports a change of position use the event data to
//set and report the x,y position on the mouse.
$(draw.getCanvas()).mousemove( function(evt) {

  draw.setXY(evt);
  draw.writeXY();
  if (draw.getShape()=='path'){
    draw.draw();
  }
});

//3-point Set the starting position
// draw.getCanvas().addEventListener('mousedown', function(){
  $(draw.getCanvas()).mousedown( function(evt) {
    if(draw.getShape()!=='3-point'){
      draw.setStart();
      draw.setIsDrawing(true);
  }
});

//Get the ending position
// draw.getCanvas().addEventListener('mouseup', function(){
  $(draw.getCanvas()).mouseup( function() {
    if(draw.getShape()!=='3-point'){
      draw.setEnd();
      draw.draw();
      draw.setIsDrawing(false);
  }

  if(draw.getShape()==='3-point'){
      draw.setPoint();
  }
  });

// draw.getCanvas().addEventListener('mousedown', function() {
$(draw.getCanvas()).mousedown( function() {
  draw.setMouseDown(true);
  draw.setStart();
});

// draw.getCanvas().addEventListener('mouseup', function() {
$(draw.getCanvas()).mouseup( function() {
  draw.setMouseDown(false);
  draw.setEnd();
  draw.draw();
});

$(draw.getCanvas()).mousemove( function(evt) {
  draw.setXY(evt);
  draw.writeXY();
  if(draw.getShape()=='path' && draw.getIsDrawing()===true) {
    draw.draw();
  }
});

$(function(){
  $('#btnRect').on('click',function(){
    $('#selShape').text('RECTANGLE');
    draw.setShape('rectangle');
  });

});


$(function(){
  $('#btnLine').on('click',function(){
    $('#selShape').text('LINE');
    draw.setShape('line');
  });

});

//Draw a three point triangle
$(function(){
  $('#btn3Point').on('click',function(){
    $('#selShape').text('3-point');
    draw.setShape('3-point');
  });

});


$(function(){
  $('#btnCircle').on('click',function(){
    $('#selShape').text('CIRCLE');
    draw.setShape('circle');
  });

});

$(function(){
  $('#btnTriangle').on('click',function(){
    $('#selShape').text('TRIANGLE');
    draw.setShape('triangle');
  });

});


$(function(){
  $('#btnIsos').on('click',function(){
    $('#selShape').text('ISOSCELES TRIANGLE');
    draw.setShape('isos');
  });

});

$(function(){
  $('#btnResetCanvas').on('click',function(){
    draw.resetCanvas()
  });

});

$(function(){
  $('#btnLineWidth').on('click',function(){
    draw.lineWidth();
  });

});

$(function(){
  $('#btnPath').on('click',function(){
    $('#selShape').text('PATH');
    draw.setShape('path');
  });

});

$(function(){
  $('#btnRandomColor').on('click',function(){
    draw.setColorSw(true);
  });

});

$(function(){
  $('#btnSelColor').on('click',function(){
  //  console.log('     ---  in btnbtnSelColor');
    draw.setColorSw(false);
  });

});