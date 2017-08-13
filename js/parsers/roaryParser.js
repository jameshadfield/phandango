import Papa from 'papaparse';
import { Arrow, Block, Contig, colourDB } from './shapes';
import chroma from 'chroma-js';

/* ROARY parser
 * @param csvString {string} - the file contents
 *
 * read line by line (but not the first line)
 * for each line create an arrow (annotation)
 * and a block for each taxa present,
 * pushing them onto respective arrays.
 *
 * @return[0] {array of arrows} - the annotation
 * @return[0] {array of blocks} - the blocks
 *
 */

// function sortNumber(a, b) {
//   return a - b;
// }

export function roaryParser(csvString) {
  const papa = Papa.parse(csvString);

  const numEntries = (papa.data.length - 1) * (papa.data[0].length - 10);
  if (numEntries > 10000000) {
    throw 'Cannot process ROARY files with over 10M entries (this has ' + numEntries + ')';
  }

  const arrows = [];
  // const blocks = [];
  const geneLen = 20;
  const tmp = {};

  /* so we crawl the rows. Each row forms a gene (+ side arrow)
   * and contributes to a fragment (- side arrow) (idx = 6)
   * then, while in the row
   * we crawl the columns which form a binary matrix
   *
   * eventually this matrix is turned into blocks
   */

  let fragmentOpen = undefined;
  let fragmentId = papa.data[1][6]; // initialise
  const fragments = [];

  // find maximum fragment ID...
  let maxFragmentId = 0;
  for (let i = 1; i < papa.data.length; i++) {
    if (parseInt(papa.data[i][6], 10) > maxFragmentId) {
      maxFragmentId = parseInt(papa.data[i][6], 10);
    }
  }
  const fragmentColours = chroma.scale('Spectral').mode('rgb').domain([ 1, maxFragmentId ]);

  for (let rowIdx = 1; rowIdx < papa.data.length; rowIdx++) {
    arrows.push( new Arrow(
      rowIdx * geneLen,
      (rowIdx + 1) * geneLen,
      '+',
      '#318DCC',
      'black',
      1,
      'locus_tag=' + papa.data[rowIdx][0] + ';product=' + papa.data[rowIdx][2]
    ));

    // if the fragment hasn't changed we simply continue...
    if (papa.data[rowIdx][6] !== fragmentId) {
      // save the previous fragment
      fragments.push(
        new Contig(
          fragmentOpen * geneLen, // featurestart
          rowIdx * geneLen, // featureend
          fragmentColours(fragmentId).hex(), // fill
          'black', // stroke
          1, // strokeWidth
          'fragment ' + fragmentId, // contigName
          (rowIdx - fragmentOpen) * geneLen // length
        )
      );

      // start a new fragment
      fragmentOpen = rowIdx;
      fragmentId = papa.data[rowIdx][6];
      if (fragmentId > maxFragmentId) {
        maxFragmentId = fragmentId;
      }
    }

    for (let taxaColIdx = 11; taxaColIdx < papa.data[rowIdx].length; taxaColIdx++) {
      if (papa.data[rowIdx][taxaColIdx]) {
        if (tmp[papa.data[0][taxaColIdx]]) {
          tmp[papa.data[0][taxaColIdx]].push(rowIdx);
        } else {
          tmp[papa.data[0][taxaColIdx]] = [ rowIdx ];
        }
      }
    }
  }

  // now that we've gone through all the rows close the final fragment!
  fragments.push(
    new Contig(
      fragmentOpen * geneLen, // featurestart
      papa.data.length * geneLen, // featureend
      fragmentColours(fragmentId).hex(), // fill
      'black', // stroke
      1, // strokeWidth
      'fragment ' + fragmentId, // contigName
      (papa.data.length - fragmentOpen) * geneLen // length
    )
  );

  const blocks = {};
  let uniqId = 0;
  // new Block(start, end, id, {colour, taxa, node, info})
  Object.keys(tmp).forEach((taxa) => {
    blocks[taxa] = [];
    // tmp[taxa].sort(sortNumber);
    // let inBlock = true;
    let openVal = tmp[taxa][0];
    let prevVal = tmp[taxa][0];
    // let closeVal = openVal + 1;

    for (let idx = 1; idx < tmp[taxa].length - 1; idx ++) {
      const thisVal = tmp[taxa][idx];
      if (thisVal === prevVal + 1) {
        prevVal = thisVal;
      } else {
        blocks[taxa].push(new Block(openVal * geneLen, (prevVal + 1) * geneLen, uniqId++, { colour: colourDB.block.roary }));
        openVal = thisVal;
        prevVal = thisVal;
      }
    }

    // last case
    const thisVal = tmp[taxa][tmp[taxa].length - 1];
    if (thisVal === prevVal + 1) {
      blocks[taxa].push(new Block(openVal * geneLen, (thisVal + 1) * geneLen, uniqId++, { colour: colourDB.block.roary }));
    } else {
      blocks[taxa].push(new Block(openVal * geneLen, (prevVal + 1) * geneLen, uniqId++, { colour: colourDB.block.roary }));
      blocks[taxa].push(new Block(thisVal * geneLen, (thisVal + 1) * geneLen, uniqId++, { colour: colourDB.block.roary }));
    }
  });

  return [ arrows, fragments, blocks, papa.data.length * geneLen ];
}


/* HOW TO SORT:
 * (put in reducer / action)
 * create array [0, 1, 2 ... arrows.length]
 * sort this array based on the data in arrows {array}
 * create new arrows and blocks arrays
 * allocate (ref parsing, cheap) new array via:
 * newArrows[i] = oldArrows[sortedIdx[i]] for all i < arrows.length
 */
