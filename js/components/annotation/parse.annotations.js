function Arrow(featurestart, featureend, direction, fill, stroke, strokeWidth, info) {
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

function parseGff(gffString) {
  // console.log('*** annotation gff parser called ****')
  let genomeCoords = null;
  const lines = gffString.split('\n');
  // console.log(lines[0],lines[1],lines[10])
  const arrows = [];
  for (let i = 0; i < lines.length; i++) {
    const words = lines[i].split('\t');
    if (words[0][0] === '#') {
      const hwords = words[0].split(' ');
      if (hwords[0] === '##sequence-region') {
        genomeCoords = [ parseInt(hwords[2], 10) - 1, parseInt(hwords[3], 10) ];
      }
      // we should check these are the same with the GenomeStore
    } else {
      if (words[1] === 'EMBL' || words[1] === 'artemis') {
        if (words[2] === 'CDS') {
          arrows.push(
            new Arrow(
              parseInt(words[3], 10), parseInt(words[4], 10), words[6], '#318DCC', 'black', 1, words[8]
            )
          );
        } else if (words[2] === 'tRNA') {
          arrows.push(
            new Arrow(
              parseInt(words[3], 10), parseInt(words[4], 10), words[6], '#53FFE9', 'black', 1, words[8]
              )
          );
        } else if (words[2] === 'rRNA') {
          arrows.push(
            new Arrow(
              parseInt(words[3], 10), parseInt(words[4], 10), words[6], '#6F8899', 'black', 1, words[8]
            )
          );
        }
      }
    }
  }
  let ret = false;
  if (arrows.length > 0) {
    ret = [ genomeCoords, arrows ];
  }
  return (ret);
}

module.exports = { Arrow: Arrow, parse_gff: parseGff };
