function draw() {
  // basic_gubbins_blocks('canvas')
  // random_gubbins_blocks('canvas2'); console.log("random_gubbins_blocks has run");
  // coloured_blocks('canvas')
  random_gubbins_blocks('canvasTab'); console.log("random_gubbins_blocks has run");

  random_gubbins_blocks('canvas2'); console.log("random_gubbins_blocks has run");

}



function basic_gubbins_blocks(canvasid) {
  var canvas = document.getElementById(canvasid);
  var ctx = canvas.getContext('2d');

  var bheight = 10;
  var blen = 100;

  // just draw some rectangles
  ctx.fillStyle = "red";
  ctx.fillRect(100,100,blen,bheight);

  ctx.fillStyle = "orange";
  ctx.fillRect(300,130,blen,bheight);
}


function coloured_blocks(canvasid) {
  var ctx = document.getElementById(canvasid).getContext('2d');
  for (var i=0;i<6;i++){
    for (var j=0;j<6;j++){
      ctx.fillStyle = 'rgb(' + Math.floor(255-42.5*i) + ',' +
                       Math.floor(255-42.5*j) + ',0)';
      ctx.fillRect(j*25,i*25,25,25);
    }
  }
}


function set_random_gubbins_blocks(canvasid) {
  // var canvas = document.getElementById(canvasid);
  // var ctx = canvas.getContext('2d');

  var bheight = 10;
  var ystart = 10;
  var maxwidth = 700;

  var cols = ["orange","red","blue","yellow"];


  for (var linenum=1;linenum<30;linenum++) {
    ystart += bheight + 5;
    var xstart = Math.floor((Math.random() * 30) + 1);;

    for (var blocknum=1;blocknum<20;blocknum++) {
      blocklen = Math.floor((Math.random() * 100) + 1);

      // ctx.fillStyle = cols[Math.floor((Math.random() * 4) )];

      addBlock(xstart,ystart,blocklen,bheight,cols[Math.floor((Math.random() * 4) )]);

      // ctx.fillRect(xstart,ystart,blocklen,bheight);

      xstart += blocklen + Math.floor((Math.random() * 100) + 1);
      if (xstart > maxwidth) {
        console.log("max width reached at line "+linenum+" after "+blocknum+" blocks");
        break
      }

    }
  }
}

// holds all our tab parsed blocks
var blocks = [];

// Box object to hold data for all drawn rects
function Block() { this.x = 0; this.y = 0; this.w = 1; this.h = 1; this.fill = '#444444';}

//Initialize a new Box, add it, and invalidate the canvas
function addBlock(x, y, w, h, fill) {
  var rect = new Block;
  rect.x = x;
  rect.y = y;
  rect.w = w
  rect.h = h;
  rect.fill = fill;
  blocks.push(rect);
  invalidate();
}


function drawBlocks() {
  console.log("drawBlocks outer called");
  if (canvasValid == false) {
    console.log("drawBlocks inner called");
    clear(ctx);

    // draw all boxes
    var l = blocks.length;
    for (var i = 0; i < l; i++) {
      ctx.fillStyle = blocks[i].fill;
      ctx.fillRect(blocks[i].x,blocks[i].y,blocks[i].w,blocks[i].h);
    }
    canvasValid = true;
  }
}

function invalidate() {canvasValid = false}

function clear(c) {c.clearRect(0, 0, WIDTH, HEIGHT);}

////////////////////////////////////////////////////

function init() {
  console.log("init() called");
  canvas = document.getElementById('canvasTab');
  ctx = canvas.getContext('2d');
  HEIGHT = canvas.height;
  WIDTH = canvas.width;
  canvasValid = false
  var INTERVAL = 100;  // how often, in milliseconds, we check to see if a redraw is needed

  set_random_gubbins_blocks(canvas)

  // drawBlocks()
  setInterval(drawBlocks, INTERVAL);
}









