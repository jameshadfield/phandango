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


function random_gubbins_blocks(canvasid) {
  var canvas = document.getElementById(canvasid);
  var ctx = canvas.getContext('2d');

  var bheight = 10;
  ctx.fillStyle = "orange";
  var ystart = 10;
  var maxwidth = 700;

  var cols = ["orange","red","blue","yellow"];


  for (var linenum=1;linenum<30;linenum++) {
    ystart += bheight + 5;
    var xstart = Math.floor((Math.random() * 30) + 1);;

    for (var blocknum=1;blocknum<20;blocknum++) {
      blocklen = Math.floor((Math.random() * 100) + 1);

      ctx.fillStyle = cols[Math.floor((Math.random() * 4) )];

      ctx.fillRect(xstart,ystart,blocklen,bheight);
      xstart += blocklen + Math.floor((Math.random() * 100) + 1);
      if (xstart > maxwidth) {
        console.log("max width reached at line "+linenum+" after "+blocknum+" blocks");
        break
      }

    }
  }
}


// function
// someyhing
