const TaxaLocations = require('../../stores/Taxa_Locations.js');
const ErrStruct = require('../../structs/errStruct.js');
const Actions = require('../../actions/actions.js');

// function associate_taxa_with_dummy_y_values(blocks, canvasHeight) {
//   const taxa = [];
//   for (let i = 0; i < blocks.length; i++) {
//     for (let j = 0; j < blocks[i].taxa.length; j++) {
//       if (taxa.indexOf(blocks[i].taxa[j]) === -1) { // i.e. not counted yet!
//         taxa.push(blocks[i].taxa[j]);
//       }
//     }
//   }
//   const taxaYValue = [];
//   for (let k = 0; k < taxa.length; k++) {
//     taxaYValue[taxa[k]] = parseInt((k + 1) / taxa.length * (canvasHeight - 50), 10) + 25; // the -50 and -25 to create a buffer.
//   }
//   // console.log(taxaYValue)
//   return (taxaYValue);
// }

// Given a massive list of blocks, we can remove those which fall outside the current genome view
// Now is also the time to add in x and y values for each block which are in pixels relartive to the canvas
// so that the draw() funciton becomes trivial
function trimBlocks(rawBlocks, visibleGenomeCoords, canvas) {
  const basesVisible = visibleGenomeCoords[1] - visibleGenomeCoords[0];
  const trimmedBlocks = [];
  const activeTaxa = Object.keys(TaxaLocations.getAll()); // all taxa which are currently "active"
  const isPhyloCanvasActive = TaxaLocations.loaded();
  if (isPhyloCanvasActive === false) {
    // we *should* create a dummy tree here (flat tree)
    // but for now... create an error
    const errStr = [
      'Currently a tree is required to display the genomic data.',
    ];
    const errObj = new ErrStruct(true, 'ERROR: No tree.', errStr);
    Actions.newErr([ errObj ]);
    return [];
  }

  for (let i = 0; i < rawBlocks.length; i++) {
    // check if in view here
    if (rawBlocks[i].start_base >= visibleGenomeCoords[1] || rawBlocks[i].end_base <= visibleGenomeCoords[0]) {
      continue;
    }
    let anyTaxaInView = false;
    for (let j = 0; j < rawBlocks[i].taxa.length; j++) {
      if (activeTaxa.indexOf(rawBlocks[i].taxa[j]) > -1) {
        anyTaxaInView = true;
        break;
      }
    }
    if (anyTaxaInView === false) {continue;}

    const newBlock = rawBlocks[i]; // pass by reference
    newBlock.x1 = parseInt( (newBlock.start_base - visibleGenomeCoords[0]) / basesVisible * canvas.width, 10);
    newBlock.x2 = parseInt( (newBlock.end_base - visibleGenomeCoords[0])  / basesVisible * canvas.width, 10);

    // how many pixels?  if 2 or 1 or 0 then don't bother
    if ((newBlock.x2 - newBlock.x1) <= 2) {continue;}

    // calculate the y-values
    if (isPhyloCanvasActive) {
      const tmp = TaxaLocations.getTaxaY(newBlock.taxa);
      if (tmp === null) {
        continue;
      }
      newBlock.y1 = tmp[0];
      newBlock.y2 = tmp[1];
    } // else { // no phylocanvas!!!!!!!!!!
    //   const centerYCoords = []; // y-coords of all taxa in block (could be only one if blue)
    //   for (const key in taxaYValue) {
    //     if ( newBlock.taxa.indexOf(key) > -1 ) { // HIT
    //       centerYCoords.push( taxaYValue[key] );
    //     }
    //   }
    //   newBlock.y1 = Math.min.apply(null, centerYCoords) - 5;
    //   newBlock.y2 = Math.max.apply(null, centerYCoords) + 5;
    // }
    trimmedBlocks.push(newBlock);
  }
  return (trimmedBlocks);
}

module.exports = trimBlocks;
