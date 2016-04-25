/* drawGraphAxis
Versitile axis drawer for graphs
@posArg canvas
@namedArgs: (all optional, if none then give an empty object)
      suffix {string} - text to print after number on graph (e.g. '%')
      yMaxValue {int} - maximum y value of the graph
      numTicks {int}
      dottedLines {false | array} - array of y values to plot dotted lines
*/

export function drawGraphAxis(canvas, {
  suffix = '',
  yMaxValue = '100',
  numTicks = 4,
  dottedLines = false,
  pdfoutput = false,
}) {
  let context = this.canvas.getContext('2d');
  if (pdfoutput) {
    context = window.svgCtx;
  }
  drawOutline(canvas, context, pdfoutput);
  // if yMaxValue is 0 then return immediately
  if (!yMaxValue) {return;}
  // horisontal dotted lines
  if (dottedLines) {
    for (const i of dottedLines) {
      drawDottedLine(canvas, context, valToPx(canvas, i, yMaxValue), pdfoutput);
    }
  }
  // find numerical values of ticks to display
  const chunk = Math.ceil(parseFloat(yMaxValue / numTicks, 10));
  // yMaxValue = chunk * numTicks;
  const tickNums = [ ...Array(numTicks) ].map(
    (cv, idx) => (idx + 1) * chunk
  );
  // draw ticks (not the text, just the tick)
  const tickPixels = valToPx(canvas, tickNums, yMaxValue);
  drawTicksAtPx(context, tickPixels, pdfoutput);

  // draw text of ticks
  context.save();

  context.fillStyle = 'black';
  context.textBaseline = 'middle';
  context.textAlign = 'left';
  context.font = '12px Helvetica';
  for (let i = 0; i < numTicks; ++i) {
    const offset = i + 1 === numTicks ? 5 : 0;
    context.fillText(tickNums[i] + suffix, 5, tickPixels[i] + offset);
  }

  context.restore();
}

/* function valToPx
 * convert value to pixels measured from 0 (i.e. the top)
 * e.g. 100% is 0 as it's at the top, 0 always returns canvas.height (i.e. the bottom)
 * @param canvas
 * @param value {num | array of nums}
 * @param yMaxVal {num} - set to 100 if percentages (eg)
 */
function valToPx(canvas, value, yMaxVal) {
  function calcPx(val) {
    return parseInt(canvas.height * (1 - val / yMaxVal), 10);
  }
  let ret;
  if (value instanceof Array) {
    ret = value.map( (cv) => calcPx(cv));
  } else {
    ret = calcPx(value);
  }
  return ret;
}

/* function: drawOutline (i.e. the actual lines making the axis)
 * @param canvas
 * @param context
 */
function drawOutline(canvas, context, pdfoutput = false) {
  context.save();
  if (!pdfoutput) {
    context.beginPath();
  }
  context.moveTo(canvas.width, canvas.height);
  context.lineTo(0, canvas.height); // bottom line
  context.lineTo(0, 0); // left hand axis (move to top left)
  context.stroke();
  context.restore();
}

/* drawTicksAtPx (the little horisontal tick marks)
 * @param context - canvas 2d context
 * @param vals {array of nums} - positions in pixels (y axis, measured from top) to draw lines
 * @param (optional) tickLengthPx - extends right (into the graph!)
 */
function drawTicksAtPx(context, vals, pdfoutput = false, tickLengthPx = 5) {
  // we are starting at 0,0 (i.e. TOP LEFT)
  if (!pdfoutput) {
    context.beginPath();
  }
  context.moveTo(0, 0);
  for (let i = 0; i < vals.length; i++) {
    context.lineTo(0, vals[i]);
    context.lineTo(tickLengthPx, vals[i]);
    context.lineTo(0, vals[i]);
  }
  context.stroke();
}

/* drawDottedLine
 * @param canvas
 * @param context - canvas 2d context
 * @param yValPx {array of nums} - measured from top (0)
 * @param (optional) colour {string}
 * @param (optional) dash {array of 2 nums} - dash style (line length, gap length)
 */
function drawDottedLine(canvas, context, yValPx, pdfoutput = false, colour = 'red', dash = [ 5, 10 ]) {
  context.save();
  context.strokeStyle = colour;
  context.setLineDash(dash);
  context.beginPath();
  context.moveTo(0, yValPx);
  context.lineTo(canvas.width, yValPx);
  context.stroke();
  context.restore();
}
