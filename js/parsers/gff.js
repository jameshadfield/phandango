import { Arrow, Block, Contig, colourDB } from './shapes';

export function gffParser(gffString) {
  return new Promise((resolve, reject) => {
    // console.log('*** annotation gff parser called ****')
    let genomeCoords = null;
    const contigOrder = [];
    const contigStart = {};
    const contigLocations = {};
    let genomeLength = 0;
    const lines = gffString.split('\n');
    // console.log(lines[0],lines[1],lines[10])
    const shapes = [];
    const contigShapes = [];
    let contigColour = 'orange';
    for (let i = 0; i < lines.length; i++) {
      const words = lines[i].split('\t');
      if (words[0][0] === '#') {
        const hwords = words[0].match(/\S+/g);
        if (hwords[0] === '##sequence-region') {
          genomeCoords = [ parseInt(hwords[2], 10) - 1, parseInt(hwords[3], 10) ];
          contigOrder.push(hwords[1]);
          contigStart[hwords[1]] = genomeLength;
          contigShapes.push(
            new Contig(
              parseInt(hwords[2], 10) + contigStart[hwords[1]], parseInt(hwords[3], 10) + contigStart[hwords[1]], contigColour, 'black', 1, hwords[1], parseInt(hwords[3], 10) - (parseInt(hwords[2], 10) - 1)
              )
          );
          if (contigColour === 'orange') {
            contigColour = 'brown';
          } else {
            contigColour = 'orange';
          }
          contigLocations[hwords[1]] = [ parseInt(hwords[2], 10) - 1, parseInt(hwords[3], 10) ];
          genomeLength += parseInt(hwords[3], 10);
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
          // new Block(start, end, id, {colour, taxa, node, info})
          new Block(parseInt(words[3], 10), parseInt(words[4], 10), i, {
            colour: node ? colourDB.block.gubbinsNode : colourDB.block.gubbinsLeaf,
            taxa: taxa,
            node: node,
            info: { nll: parseInt(nll, 10), numSnps: numSnps, nTaxa: taxa.length },
          })
        );
      } else {
        let startOfContig = 0;
        if (words[0] in contigStart) {
          startOfContig = contigStart[words[0]];
        }
        if (words[2] === 'CDS') {
          if (parseInt(words[4], 10) > genomeLength) {
            genomeLength = parseInt(words[4], 10);
          }

          shapes.push(
            new Arrow(
              parseInt(words[3], 10) + startOfContig, parseInt(words[4], 10) + startOfContig, words[6], '#318DCC', 'black', 1, words[8], words[0], words[3], words[4]
            )
          );
        } else if (words[2] === 'tRNA') {
          shapes.push(
            new Arrow(
              // console.log(words[3], words[4]);
              parseInt(words[3], 10) + startOfContig, parseInt(words[4], 10) + startOfContig, words[6], '#53FFE9', 'black', 1, words[8], words[0], words[3], words[4]
              )
          );
        } else if (words[2] === 'rRNA') {
          shapes.push(
            new Arrow(
              parseInt(words[3], 10) + startOfContig, parseInt(words[4], 10) + startOfContig, words[6], '#6F8899', 'black', 1, words[8], words[0], words[3], words[4]
            )
          );
        }
      }
    }

    genomeCoords = [ 0, genomeLength ];

    if ((contigShapes.length > 0 || shapes.length > 0) && genomeCoords) {
      resolve([ genomeCoords, shapes, contigShapes ]);
    } else {
      reject('GFF parsing failed');
    }
  });
}
