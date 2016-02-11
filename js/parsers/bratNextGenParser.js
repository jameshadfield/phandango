import { Block } from './shapes';

/* bratNextGen format:
LIST OF FOREIGN GENOMIC SEGMENTS:
Start     End       Origin  HomeCluster  BAPSIndex  StrainName
478150    495574    4       4            2          3948_7_10
*/

export function bratNextGenParser(gffString) {
  return new Promise((resolve) => {
    const lines = gffString.split('\n');
    const shapes = {};
    for (let i = 2; i < lines.length; i++) {
      const words = lines[i].split(/\s+/);
      if (shapes[words[5]]) {
        shapes[words[5]].push(
          new Block(parseInt(words[0], 10), parseInt(words[1], 10), i, { colour: 'Orange' })
        );
      } else {
        shapes[words[5]] = [
          new Block(parseInt(words[0], 10), parseInt(words[1], 10), i, { colour: 'Orange' }),
        ];
      }
    }
    resolve(shapes);
  });
}


// export function bratNextGenParser(gffString) {
//   return new Promise((resolve) => {
//     const lines = gffString.split('\n');
//     const shapes = [];
//     for (let i = 2; i < lines.length; i++) {
//       const words = lines[i].split(/\s+/);
//       shapes.push(
//         new Block( // startBase, endBase, taxa, node, nll, snps, uniq_ID
//           parseInt(words[0], 10), parseInt(words[1], 10), [ words[5] ], 0, 0, 0, i
//         )
//       );
//     }
//     for (let i = 0; i < shapes.length; i++) {
//       shapes[i].fill = 'blue';
//     }
//     resolve(shapes);
//   });
// }
