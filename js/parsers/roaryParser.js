import Papa from 'papaparse';
import { Arrow, Block } from './shapes';

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
 */

export function roaryParser(csvString) {
  const papa = Papa.parse(csvString);
  const arrows = [];
  const blocks = [];
  const geneLen = 100;

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

    for (let taxaColIdx = 11; taxaColIdx < papa.data[rowIdx].length; taxaColIdx++) {
      if (papa.data[rowIdx][taxaColIdx]) {
        blocks.push( new Block(
          rowIdx * geneLen,
          (rowIdx + 1) * geneLen,
          [ papa.data[0][taxaColIdx] ],
          0,
          0,
          0,
          0
        ));
      }
    }
  }
  return [ arrows, blocks, papa.data.length * geneLen ];
}


/* HOW TO SORT:
 * (put in reducer / action)
 * create array [0, 1, 2 ... arrows.length]
 * sort this array based on the data in arrows {array}
 * create new arrows and blocks arrays
 * allocate (ref parsing, cheap) new array via:
 * newArrows[i] = oldArrows[sortedIdx[i]] for all i < arrows.length
 */
