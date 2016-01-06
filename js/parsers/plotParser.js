import { Ellipse } from './shapes';
// this, at the moment, is for GWAS plots (CHR  SNP BP  -log_10(p)  R^2)

export function plotParser(stringIn) {
  const lines = stringIn.split('\n');
  const shapes = [];
  for (let i = 0; i < lines.length; i++) {
    const words = lines[i].split('\t');
    // words: CHR SNP BP  -log_10(p)  R^2
    //         0   1   2    3          4
    let pVal = parseFloat(words[3]);
    if (pVal < 0) {
      pVal = -1 * pVal;
    }
    if (!isNaN(pVal)) {
      // is the plot a normal plink output or seer?
      if (words[2].indexOf('..') > -1) { // seer
        const xVals = [];
        xVals.push(parseInt(words[2].split('..')[0], 10));
        xVals.push(parseInt(words[2].split('..')[1], 10));
        let radius = parseInt((xVals[1] - xVals[0]) / 2, 10);
        if (radius < 0) {
          radius = -1 * radius;
        }
        shapes.push(new Ellipse(
          xVals[0] + radius,
          pVal,
          parseFloat(words[4]),
          radius
        ));
      } else {
        shapes.push(new Ellipse(
          parseFloat(words[2]),
          pVal,
          parseFloat(words[4])
        ));
      }
    }
  }
  return shapes;
}
