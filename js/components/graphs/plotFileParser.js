const Actions = require('../../actions/actions.js');
// this, at the moment, is for GWAS plots (CHR  SNP BP  -log_10(p)  R^2)

function Circle(featurex, featurey, val1) {
  this.fill = '#AAAAAA';
  this.stroke = 'black';
  this.strokeWidth = 1;
  this.featurex = featurex;
  this.featurey = featurey;
  this.x = undefined;
  this.y = undefined;
  this.r = undefined;
  this.rSquared = val1;
  this.selected = false;
  if (val1 > 0.8) {
    this.fill = '#FF0000';
  } else if (val1 > 0.6) {
    this.fill = '#FFA500';
  } else if (val1 > 0.4) {
    this.fill = '#32CD32';
  } else if (val1 > 0.2) {
    this.fill = '#87CEFA';
  } else if (val1 >= 0) {
    this.fill = '#0000FF';
  }
}

// Draws this circle to a given context
Circle.prototype.draw = function (ctx) {
  ctx.fillStyle = this.fill;
  ctx.strokeStyle = this.stroke;
  ctx.lineWidth = this.strokeWidth;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
  if (this.selected) {
    ctx.stroke();
  }
  ctx.fill();
  ctx.save();
  if (this.selected) {
    ctx.save();
    ctx.fillStyle = 'black';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.font = '12px Helvetica';
    const text = '-log10(p)=' + this.featurey.toFixed(2).toString() + ' R^2=' + this.rSquared.toFixed(2).toString();
    ctx.fillText(text, this.x, this.y - this.r * 4 < 15 ? this.y + this.r * 4 : this.y - this.r * 4);
    ctx.restore();
  }
};

function parser(stringIn) {
  const lines = stringIn.split('\n');
  const circles = [];
  let dataEnd = 0;
  const yValues = [];
  for (let i = 0; i < lines.length; i++) {
    const words = lines[i].split('\t');
    // words: CHR SNP BP  -log_10(p)  R^2
    //      0 1 2   3   4
    if (!isNaN(parseFloat(words[3], 10))) {
      if (parseFloat(words[2]) > dataEnd) {
        dataEnd = parseFloat(words[2]);
      }
      yValues.push(parseFloat(words[3]));
      circles.push(new Circle(parseFloat(words[2]), parseFloat(words[3]), parseFloat(words[4]), parseFloat(words[5])));
    }
  }
  Actions.save_plotYvalues(yValues, 'GWAS');
  return circles;
}

module.exports = parser;
