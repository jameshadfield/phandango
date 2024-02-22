/* colours are used by shape constructors as
 * well as line graphs reducers, block reducers
 * http://html-color-codes.info/color-names/
 */
export const colourDB = {
  block: {
    gubbinsLeaf: 'blue',
    gubbinsNode: 'red',
    gubbinsPerTaxa: 'dodgerblue',
    bratNextGen: {
      default: 'darkorange',
    },
    merge: 'limegreen',
    roary: 'mediumblue',
    unknown: 'black', // how does this happen?
  },
  line: {
    // subline: '#bbbbbb', // currently hard-coded in lineGraph.jsx
    gubbins: 'black',
    gubbinsPerTaxa: 'dodgerblue',
    bratNextGen: 'darkorange',
    roary: 'mediumblue',
  },
  artemis: {
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
    14: '#000000',
    15: '#ff3f3f',
    16: '#ff7f7f',
    17: '#ff7f7f'
  },
};

export function Arrow(featurestart, featureend, direction, fill, stroke, strokeWidth, info, contig, contigstart, contigend) {
  // This is a very simple and unsafe constructor.
  // All we're doing is checking if the values exist.
  // 'x || 0' just means 'if there is a value for x, use that. Otherwise use 0.'
  this.direction = direction || 'None';
  this.fill = fill || '#AAAAAA';
  this.stroke = stroke || 'black';
  this.strokeWidth = strokeWidth || 1;
  this.info = info || '';
  this.contig = contig || '';
  this.featurestart = featurestart || 0;
  this.featureend = featureend || 0;
  this.contigstart = contigstart || 0;
  this.contigend = contigend || 0;
  this.x = 0;
  this.y = 0;
  this.w = 1;
  this.h = 20;
  this.coordinates = [];
  this.ID = '';
  this.product = '';
  this.fields = {};

  // if (this.fill==='#53FFE9'){
  //   console.log(this.contigstart, this.contigend);}

  this.fields.Contig = this.contig;
  this.fields['Contig coordinates'] = this.contigstart + '..' + this.contigend;
  this.fields['Genome coordinates'] = parseInt(this.featurestart, 10) + '..' + parseInt(this.featureend, 10);
  this.fields.Length = this.featureend - this.featurestart;

  const infoparts = this.info.split(';');
  // console.log(infoparts);
  for (let i = 0; i < infoparts.length; i++) {
    const varval = infoparts[i].split('=');
    if (varval.length < 2) {
      continue;
    }
    const variable = varval[0].replace(/(^'|'$)/g, '').replace(/(^"|"$)/g, '');
    const value = varval[1].replace(/(^'|'$)/g, '').replace(/(^"|"$)/g, '').substring(0, 50);

    if (variable && value) {
      this.fields[variable] = value;
    }

    // if (variable === 'ID') {
    //   this.ID = value;
    // } else if (variable === 'product') {
    //   this.product = value.replace(/(^'|'$)/g, '');
    // } else if (variable === 'locus_tag') {
    //   this.locus_tag = value.replace(/(^'|'$)/g, '');
    // }
    if ((variable === 'color') || (variable === 'colour')) {
      const colourValue = +value.replace(/(^'|'$)/g, '');

      if (!isNaN(colourValue)) {
        if (colourValue < 18 && colourValue > -1) {
          this.fill = colourDB.artemis[colourValue];
          // console.log(this.ID, this.product, this.fill, colour_value);
        }
      }
      else {
        this.fill = colourValue;
      }
    }
  }
}


export function Contig(featurestart, featureend, fill, stroke, strokeWidth, contigName, length) {
  // This is a very simple and unsafe constructor.
  // All we're doing is checking if the values exist.
  // 'x || 0' just means 'if there is a value for x, use that. Otherwise use 0.'
  this.fill = fill || '#AAAAAA';
  this.stroke = stroke || 'black';
  this.strokeWidth = strokeWidth || 1;
  this.contigName = contigName || '';
  this.featurestart = featurestart || 0;
  this.featureend = featureend || 0;
  this.length = length || 0;
  this.x = 0;
  this.y = 0;
  this.w = 1;
  this.h = 10;
  this.direction = 'None';
  this.coordinates = [];
  this.fields = {};
  this.fields.Contig = this.contigName;
  this.fields.Length = this.length;
}

/* Block constructor
 * there are only three essential fields here - startBase, endBase and id (unique integer)
 * if you don't use any optional arguments you must pass {}
 * optional arguments:
 * taxa - saved to this.taxa
 * colour - saved to fill
 * node - saved but not used in display yet
 * (if node is false then it's a leaf (croucher's version would display blue))
 * info {obj} - a map of names and values to be displayed, e.g. nll, snps
 * summary:
 * // new Block(start, end, id, {colour, taxa, node, info})
 */
export function Block(startBase, endBase, id, {
  colour = undefined,
  taxa = undefined,
  node = false,
  info = {},
}) {
  this.startBase = startBase;
  this.endBase = endBase;
  this.id = id; // unique
  this.taxa = taxa;
  this.info = info;
  this.node = node;
  if (colour) {
    this.fill = colour;
  } else {
    this.fill = colourDB.block.unknown;
  }
  // the following are used by the display, added here for speed (?)
  this.x1 = 0;
  this.x2 = 0;
  this.y1 = 0;
  this.y2 = 0;
}

/* Ellipse */
export function Ellipse(featurex, featurey, val1, radiusX = false) {
  this.stroke = 'black';
  this.strokeWidth = 1;
  this.featurex = featurex;
  this.featurey = featurey;
  this.radiusX = radiusX;
  this.rSquared = val1;
  // R^2 -> colour. For seer output all values are zero which will result in
  // blue dots. Versions 1.3.0 and earlier would use gray instead.
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

