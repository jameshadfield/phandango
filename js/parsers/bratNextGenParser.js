import { Block, colourDB } from './shapes';
import { _getColourScale } from './metadataParser';
/* bratNextGen format:
LIST OF FOREIGN GENOMIC SEGMENTS:
Start     End       Origin  HomeCluster  BAPSIndex  StrainName
478150    495574    4       4            2          3948_7_10
*/

export function bratNextGenParser(gffString) {
  return new Promise((resolve) => {
    const lines = gffString.split('\n');
    const numClusters = findNumClusters(lines);
    const colScale = _getColourScale(numClusters.home, 'int', false);
    // NB we are keeping colours 1-based (colours[0] is never used)
    const colours = [ undefined ];
    const taxaClusterMap = {};
    for (let i = 0; i < numClusters.home; i++) {
      colours.push(colScale(i).hex());
    }
    colours.push('DarkGray'); // the foreign cluster
    const shapes = {};
    for (let i = 2; i < lines.length; i++) {
      const words = lines[i].split(/\s+/);
      if (shapes[words[5]]) {
        shapes[words[5]].push(
          new Block(parseInt(words[0], 10), parseInt(words[1], 10), i, { colour: colours[parseInt(words[2], 10)] })
        );
      } else {
        shapes[words[5]] = [
          new Block(parseInt(words[0], 10), parseInt(words[1], 10), i, { colour: colours[parseInt(words[2], 10)] }),
        ];
      }
      taxaClusterMap[words[5]] = parseInt(words[3], 10);
    }
    resolve([ shapes, { taxaClusterMap, colours } ]);
  });
}

/* return the number of Origin and HomeCluster clusters */
function findNumClusters(lines) {
  let numOrigin = 0;
  let numHome = 0;
  for (let i = 2; i < lines.length; i++) {
    const words = lines[i].split(/\s+/);
    if (parseInt(words[2], 10) > numOrigin) {
      numOrigin = parseInt(words[2], 10);
    }
    if (parseInt(words[3], 10) > numHome) {
      numHome = parseInt(words[3], 10);
    }
  }
  console.assert( (numHome + 1) === numOrigin, 'UNEXPECTED: bratNextGen parser found ' + numHome + ' home and ' + numOrigin + ' origin clusters.');
  return ({ origin: numOrigin, home: numHome });
}
