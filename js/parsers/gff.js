import { Arrow, Block } from './shapes';

export function gffParser(gffString) {
  return new Promise((resolve, reject) => {
    // console.log('*** annotation gff parser called ****')
    let genomeCoords = null;
    const lines = gffString.split('\n');
    // console.log(lines[0],lines[1],lines[10])
    const shapes = [];
    for (let i = 0; i < lines.length; i++) {
      const words = lines[i].split('\t');
      if (words[0][0] === '#') {
        const hwords = words[0].split(' ');
        if (hwords[0] === '##sequence-region') {
          genomeCoords = [ parseInt(hwords[2], 10) - 1, parseInt(hwords[3], 10) ];
        }
      } else if (words[1] === 'GUBBINS') {
        const taxa = lines[i].split('taxa=\"')[1].split('\"')[0].split(/\s+/).filter(Boolean);
        let node;
        if (taxa.length > 1) {
          node = lines[i].split('node=\"')[1].split('\"')[0].split('->');
        } else {
          node = false;
        }
        const nll = lines[i].split('neg_log_likelihood=\"')[1].split('\"')[0];
        const numSnps =  lines[i].split('snp_count=\"')[1].split('\"')[0];
        shapes.push(
          new Block( // start_base, end_base, taxa, node, nll, snps, uniq_ID
            words[3], words[4], taxa, node, nll, numSnps, i
          )
        );
      } else {
        if (words[2] === 'CDS') {
          shapes.push(
            new Arrow(
              parseInt(words[3], 10), parseInt(words[4], 10), words[6], '#318DCC', 'black', 1, words[8]
            )
          );
        } else if (words[2] === 'tRNA') {
          shapes.push(
            new Arrow(
              parseInt(words[3], 10), parseInt(words[4], 10), words[6], '#53FFE9', 'black', 1, words[8]
              )
          );
        } else if (words[2] === 'rRNA') {
          shapes.push(
            new Arrow(
              parseInt(words[3], 10), parseInt(words[4], 10), words[6], '#6F8899', 'black', 1, words[8]
            )
          );
        }
      }
    }
    if (shapes.length > 0 && genomeCoords) {
      resolve([ genomeCoords, shapes ]);
    } else {
      reject('GFF parsing failed');
    }
  });
}

/*
Gubbins additionally did this:
    const plotYvalues = blocksToLineGraphData(blocks, genomeCoords[1], false);
    Actions.save_plotYvalues(plotYvalues, 'recombGraph');
*/
