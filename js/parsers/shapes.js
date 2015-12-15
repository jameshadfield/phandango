export function Arrow(featurestart, featureend, direction, fill, stroke, strokeWidth, info) {
  // This is a very simple and unsafe constructor.
  // All we're doing is checking if the values exist.
  // 'x || 0' just means 'if there is a value for x, use that. Otherwise use 0.'
  this.direction = direction || 'None';
  this.fill = fill || '#AAAAAA';
  this.stroke = stroke || 'black';
  this.strokeWidth = strokeWidth || 1;
  this.info = info || '';
  this.featurestart = featurestart || 0;
  this.featureend = featureend || 0;
  this.x = 0;
  this.y = 0;
  this.w = 1;
  this.h = 20;
  this.coordinates = [];
  this.ID = '';
  this.product = '';
  const artemisColours = {
    0: 'white',
    1: '#707070',
    2: '#C80000',
    3: '#2C802D',
    4: '#2A2C92',
    5: '#22A5A3',
    6: '#A61785',
    7: '#E9E930',
    8: '#19CE2E',
    9: '#19ACCE',
    10: '#ED961D',
    11: '#6B4E25',
    12: '#DB66D1',
    13: '#AFADAF',
  };

  const infoparts = this.info.split(';');
  // console.log(infoparts);
  for (let i = 0; i < infoparts.length; i++) {
    const varval = infoparts[i].split('=');
    if (varval.length < 2) {
      continue;
    }
    const variable = varval[0].replace(/(^'|'$)/g, '');
    const value = varval[1].replace(/(^'|'$)/g, '');

    if (variable === 'ID') {
      this.ID = value;
    } else if (variable === 'product') {
      this.product = value.replace(/(^'|'$)/g, '');
    } else if (variable === 'locus_tag') {
      this.locus_tag = value.replace(/(^'|'$)/g, '');
    } else if ((variable === 'color') || (variable === 'colour')) {
      const colourValue = +value.replace(/(^'|'$)/g, '');

      if (!isNaN(colourValue)) {
        if (colourValue < 14 && colourValue > -1) {
          this.fill = artemisColours[colourValue];
          // console.log(this.ID, this.product, this.fill, colour_value);
        }
      }
    }
  }
}

// Block: this is an object / container contstructor
export function Block(startBase, endBase, taxa, node, nll, snps, id) {
  // This is a very simple and unsafe constructor.
  // All we're doing is checking if the values exist.
  // if this.node is false then it's a leaf (croucher's version would display blue)
  this.start_base = startBase;
  this.end_base = endBase;
  this.taxa = taxa;
  this.node = node;
  this.nll = nll; // neg-log-likelihood
  this.snps = snps;
  if (this.node) {
    this.fill = 'red'; // you can change this with another function
  } else {
    this.fill = 'blue';
  }
  this.fillAlpha = 1;
  // the following are measured in pixels relative to the canvas (and therefore unknown at the moment)
  this.x1 = 0;
  this.x2 = 0;
  this.y1 = 0;
  this.y2 = 0;
  this.id = id; // unique ID
}
