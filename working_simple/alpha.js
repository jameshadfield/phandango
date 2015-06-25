// james hadfield / WTSI


// function basic_gubbins_blocks(canvasid) {
//   var canvas = document.getElementById(canvasid);
//   var ctx = canvas.getContext('2d');

//   var bheight = 10;
//   var blen = 100;

//   // just draw some rectangles
//   ctx.fillStyle = "red";
//   ctx.fillRect(100,100,blen,bheight);

//   ctx.fillStyle = "orange";
//   ctx.fillRect(300,130,blen,bheight);
// }


// function coloured_blocks(canvasid) {
//   var ctx = document.getElementById(canvasid).getContext('2d');
//   for (var i=0;i<6;i++){
//     for (var j=0;j<6;j++){
//       ctx.fillStyle = 'rgb(' + Math.floor(255-42.5*i) + ',' +
//                        Math.floor(255-42.5*j) + ',0)';
//       ctx.fillRect(j*25,i*25,25,25);
//     }
//   }
// }


// function set_random_gubbins_blocks(canvasid) {
//   // var canvas = document.getElementById(canvasid);
//   // var ctx = canvas.getContext('2d');

//   var bheight = 10;
//   var ystart = 10;
//   var maxwidth = 700;

//   var cols = ["orange","red","blue","yellow"];


//   for (var linenum=1;linenum<30;linenum++) {
//     ystart += bheight + 5;
//     var xstart = Math.floor((Math.random() * 30) + 1);;

//     for (var blocknum=1;blocknum<20;blocknum++) {
//       blocklen = Math.floor((Math.random() * 100) + 1);

//       // ctx.fillStyle = cols[Math.floor((Math.random() * 4) )];

//       addBlock(xstart,ystart,blocklen,bheight,cols[Math.floor((Math.random() * 4) )]);

//       // ctx.fillRect(xstart,ystart,blocklen,bheight);

//       xstart += blocklen + Math.floor((Math.random() * 100) + 1);
//       if (xstart > maxwidth) {
//         console.log("max width reached at line "+linenum+" after "+blocknum+" blocks");
//         break
//       }

//     }
//   }
// }

function create_blocks_for_an_id(name) {
  var bheight = 10
  var xstart = Math.floor((Math.random() * 30) + 1);;
  var maxwidth = 700;
  for (var blocknum=1;blocknum<20;blocknum++) {
     blocklen = Math.floor((Math.random() * 100) + 1);
     addBlock(xstart,0,blocklen,bheight,1,name);
      xstart += blocklen + Math.floor((Math.random() * 100) + 1);
      if (xstart > maxwidth) {
        break
      }
  }
}

// holds all our tab parsed blocks
var blocks = [];

// Box object to hold data for all drawn rects
function Block() { this.x = 0; this.y = 0; this.w = 1; this.h = 1; this.fill = '#444444'; this.id=""}

//Initialize a new Box, add it, and invalidate the canvas
function addBlock(x, y, w, h, fill, id) {
  var rect = new Block;
  rect.x = x;
  rect.y = y;
  rect.w = w
  rect.h = h;
  rect.fill = fill;
  rect.id = id || "unknown";
  blocks.push(rect);
  invalidate();
}


function drawBlocks() {
  // console.log("drawBlocks outer called");
  if (canvasValid == false) {
    console.log("clearing canvas and re-drawing");
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

function tree_stuff() {
  phylocanvas = new PhyloCanvas.Tree(canvasTree); // initialize your tree viewer // GLOBAL
  var newick_str = "(((ST1_8:0.006925,(ST5_2:0.002162,(ST5_1:0.000001,ST5_3:0.000001)N5:0.000001)N4:0.027575)N3:0.015317,((((((ST1_30:0.011876,((ST1_54:0.001973,ST1_50:0.002936)N13:0.001920,ST1_49:0.005908)N12:0.010853)N11:0.002243,ST1_31:0.006750)N10:0.004451,((ST1_18:0.000945,ST1_17:0.003837)N15:0.004608,ID_1690_BC9:0.013698)N14:0.001314)N9:0.000946,(ST1_15:0.000001,ST1_3:0.000001)N16:0.005751)N8:0.001908,((ST1_7:0.009592,ST1_16:0.011545)N18:0.000001,((ID_891_BC5:0.002371,(ID_598_BC4:0.001957,ID_2947_BC18:0.006876)N21:0.000001)N20:0.004526,((((ST1_39:0.003935,(ST1_11:0.007860,(ST1_34:0.005880,(ST1_33:0.004236,(ST1_42:0.008822,(ST1_40:0.000977,ST1_41:0.001946)N30:0.002939)N29:0.000001)N28:0.000001)N27:0.001308)N26:0.006969)N25:0.005095,((ST1_57:0.025120,ID_1828_BC10:0.036789)N32:0.016674,((ST1_20:0.002864,(ST1_6:0.000001,ST1_9:0.000001)N35:0.001909)N34:0.001910,((ST1_43:0.014437,(ST1_35:0.008689,ST1_38:0.020310)N38:0.000803)N37:0.005748,((ST1_32:0.001917,Paris:0.001908)N40:0.003825,ST1_59:0.015630)N39:0.000001)N36:0.000001)N33:0.002874)N31:0.000922)N24:0.002901,(((((ST1_55:0.000001,ST1_26:0.000001)N45:0.000970,(ST1_10:0.000973,ST1_47:0.004885)N46:0.000001)N44:0.001942,(ST1_27:0.000001,ST1_46:0.000001)N47:0.002921)N43:0.013488,ST1_36:0.028596)N42:0.011071,(ST7_1:0.030730,(ST1_12:0.003888,(ST1_28:0.017780,(ST72_1:0.007735,ST1_13:0.002903)N51:0.000001)N50:0.003859)N49:0.002880)N48:0.000001)N41:0.000001)N23:0.000001,ST1_48:0.029040)N22:0.000025)N19:0.001902)N17:0.003870)N7:0.007064,ID_2948_BC19:0.024400)N6:0.002605)N2:0.016740,(((ST1_22:0.004975,(((ST1_19:0.005981,(ST1_25:0.000995,(ST1_5:0.000001,ST1_24:0.000995)N59:0.000001)N58:0.001991)N57:0.000001,(ST1_23:0.002989,ST1_21:0.000995)N60:0.000001)N56:0.000001,ST1_4:0.000993)N55:0.001973)N54:0.010146,(ST1_58:0.034861,ST152_1:0.030882)N61:0.005321)N53:0.009820,ST8_1:0.021037)N52:0.002782,(((((ST7_3:0.001922,ST7_2:0.000001)N66:0.011623,ST1_29:0.004832)N65:0.000951,(ST1_44:0.004816,ST1_56:0.010335)N67:0.000975)N64:0.006021,((ST1_45:0.013927,(ID_747970_BC74:0.016663,(ID_1688_BC8:0.008922,ID_2041_BC13:0.013620)N71:0.005738)N70:0.004035)N69:0.005406,(ST1_53:0.025556,((ST1_37:0.016122,ST10_1:0.006049)N74:0.002034,(ID_6885_BC41:0.023898,(ST390_1:0.013936,ST1_14:0.007821)N76:0.001406)N75:0.004337)N73:0.013108)N72:0.008707)N68:0.007704)N63:0.004930,(ST1_2:0.017431,(ST6_1:0.001970,(ST1_52:0.001964,ST1_51:0.002464)N79:0.002441)N78:0.009438)N77:0.063974)N62:0.000001)N1;";
  phylocanvas.load(newick_str);
  phylocanvas.setTreeType('rectangular')
  phylocanvas.nodeAlign = true;

}

function redraw_things() {
  if (global_tree_redrawn==true) {
    console.log("hey... i should redraw things...")


    global_tree_redrawn=false
    update_y_values_for_blocks()
    canvasValid=false // need to get rid of this
    drawBlocks()

  }

}

function update_y_values_for_blocks() {
  var l = blocks.length;
  for (var i = 0; i < l; i++) {
    // debugger;
    console.log("block y value changed from "+blocks[i].y+" to "+phylocanvas.branches[blocks[i].id].starty)
    blocks[i].y = phylocanvas.branches[blocks[i].id].starty + phylocanvas.offsety; //- phylocanvas.canvas.canvas.height / 2;

      // in phylocanvas i think they do the following
      // account for positioning and scroll
      // y -= this.canvas.canvas.height / 2;
      // y -= this.offsety;

  }
}



////////////////////////////////////////////////////

function init() {
  console.log("init() called");
  canvas = document.getElementById('canvasTab');
  ctx = canvas.getContext('2d');
  HEIGHT = canvas.height;
  WIDTH = canvas.width;
  canvasValid = false

  var INTERVAL = 100;  // how often, in milliseconds, we check to see if a redraw is needed

  // set_random_gubbins_blocks(canvas)

  global_tree_redrawn = false

  // drawBlocks()
  // setInterval(drawBlocks, INTERVAL);


  // gubbins = new parse_gubbins()
  // xscalingfactor=canvas.width/(gubbins.end-gubbins.start)

  create_blocks_for_an_id('Paris')

  tree_stuff()

  setInterval(redraw_things,INTERVAL)

  // drawBlocks()


}









