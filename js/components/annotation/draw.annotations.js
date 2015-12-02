function clearCanvas(canvas) {
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

function drawArrows(context, arrows, drawBorder) {
  for (let i = 0; i < arrows.length; i++) {
    context.fillStyle = arrows[i].fill;
    context.strokeStyle = arrows[i].stroke;
    context.lineWidth = arrows[i].strokeWidth;
    context.beginPath();

    for (let j = 0; j < arrows[i].coordinates.length; j++) {
      context.lineTo(arrows[i].coordinates[j][0], arrows[i].coordinates[j][1]);
    }
    context.closePath();
    if (drawBorder) {
      context.stroke();
    }
    context.fill();
  }
}

function drawBorderAndText(context, arrow, middleCanvasWidth, scaleYvalue) {
  context.strokeStyle = '#CC302E';
  context.lineWidth = 2;

  context.beginPath();
  context.moveTo(arrow.coordinates[0][0], arrow.coordinates[0][1]);
  for (let j = 0; j < arrow.coordinates.length; j++) {
    context.lineTo(arrow.coordinates[j][0], arrow.coordinates[j][1]);
  }
  context.closePath();
  context.stroke();
  // TEXT
  context.fillStyle = 'black';
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.font = '12px Helvetica';
  const text = arrow.locus_tag + ' // ' + arrow.product;
  context.fillText(text, middleCanvasWidth, scaleYvalue - 40);
  // context.fillText(arrow.ID, arrow.x+(arrow.w/2), scaleYvalue-69);
  // context.fillText(arrow.locus_tag, arrow.x+(arrow.w/2), scaleYvalue-52);
  // context.fillText(arrow.product, arrow.x+(arrow.w/2), scaleYvalue-35);
}


function getArrowsInScope(arrows, visibleGenome, canvas) {
  const canvasWidth = canvas.width;
  const arrowsInScope = [];
  const middleHeight = parseInt(canvas.height / 2, 10);
  const gapToArrows = 10;
  for (let i = 0; i < arrows.length; i++) {
    if (arrows[i].featurestart > visibleGenome[1] || arrows[i].featureend < visibleGenome[0]) {
      // ignore
    } else {
      arrowsInScope.push( arrows[i] );
    }
  }
  for (let i = 0; i < arrowsInScope.length; i++) {
    arrowsInScope[i].x = (arrowsInScope[i].featurestart - visibleGenome[0]) / (visibleGenome[1] - visibleGenome[0]) * canvasWidth;
    arrowsInScope[i].w = (arrowsInScope[i].featureend - arrowsInScope[i].featurestart) / (visibleGenome[1] - visibleGenome[0]) * canvasWidth;
    // arrowsInScope[i].y  is the value of the minimum y, and .h will be added to this (.h>0)
    if (arrowsInScope[i].direction === '+') {
      arrowsInScope[i].y = middleHeight - (arrowsInScope[i].h + gapToArrows);
    } else if (arrowsInScope[i].direction === '-') {
      arrowsInScope[i].y = middleHeight + gapToArrows;
    } else {
      arrowsInScope[i].y = middleHeight - arrowsInScope[i].y / 2;
    }
    arrowsInScope[i].coordinates = [];
    arrowsInScope[i].coordinates.push([ arrowsInScope[i].x, arrowsInScope[i].y ]);
    arrowsInScope[i].coordinates.push([ arrowsInScope[i].x, arrowsInScope[i].y + arrowsInScope[i].h ]);
    arrowsInScope[i].coordinates.push([ arrowsInScope[i].x + arrowsInScope[i].w, arrowsInScope[i].y + arrowsInScope[i].h ]);
    arrowsInScope[i].coordinates.push([ arrowsInScope[i].x + arrowsInScope[i].w, arrowsInScope[i].y ]);
  }
  return arrowsInScope;
}


function drawScale(context, canvasWidth, visibleGenome, scaleYvalue, numticksOpt) {
  // console.log(context)
  context.strokeStyle = 'black';
  context.lineWidth = 1;
  // draw the horisontal line
  context.beginPath();
  context.moveTo(0, scaleYvalue);
  // console.log('context.lineTo('+canvasWidth+','+scaleYvalue+')')

  context.lineTo(canvasWidth, scaleYvalue);
  context.stroke();


  // draw the tick marks
  const numticks = numticksOpt || 6;
  const tickDistancePixels = parseInt(canvasWidth / (numticks - 1), 10);
  const tickDistanceBases = parseInt((visibleGenome[1] - visibleGenome[0]) / (numticks - 1), 10);
  for (let ticknum = 0; ticknum < numticks; ticknum++) {
    const tickpos = tickDistancePixels * ticknum;
    let tickval = visibleGenome[0] + tickDistanceBases * ticknum;
    const roundto = 2;
    // measured in megabases?
    if (tickval >= 1000000) {
      tickval = tickval / 1000000;
      tickval = String(+ tickval.toFixed(roundto)) + 'Mb';
    } else if (tickval >= 1000) { // kb
      tickval = tickval / 1000;
      tickval = String(+ tickval.toFixed(2)) + 'kb';
    } else { // bp
      tickval = String(+ tickval.toFixed(2)) + 'bp';
    }
    // console.log('tick position: '+tickpos+' tick value '+tickval)
    context.beginPath();
    context.moveTo(tickpos, scaleYvalue);
    context.lineTo(tickpos, scaleYvalue + 10);
    context.stroke();
    context.save();
    context.translate(tickpos, scaleYvalue + 10 );
    context.fillStyle = 'black';
    context.textBaseline = 'middle';
    context.textAlign = 'left';
    context.rotate(Math.PI * 0.5);
    context.font = '12px Helvetica';
    context.fillText(tickval, 0, 0);
    context.restore();
  }
}

module.exports = {
  drawArrows: drawArrows,
  getArrowsInScope: getArrowsInScope,
  clearCanvas: clearCanvas,
  drawScale: drawScale,
  drawBorderAndText: drawBorderAndText,
};
