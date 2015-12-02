const draw = require('./draw.js');
const TaxaLocations = require('../../stores/Taxa_Locations.js');
const GenomeStore = require('../../stores/genome.js');
const trimBlocks = require('./trim_blocks.js');
const MouseMoves = require('../mouse_moves.js');
const Actions = require('../../actions/actions.js');
const RegionSelectedStore = require('../../stores/RegionSelectedStore.js');
const MiscStore = require('../../stores/misc.Store.js');
const RawDataStore = require('../../stores/RawDataStore.js');


function gubbins(canvas) {
  this.canvas = canvas;
  this.context = this.canvas.getContext('2d');
  const myState = this;
  this.mouseMoves = new MouseMoves(canvas); // set up listeners
  let blocks;
  this.selected_block = undefined;

  this.loadRawData = function () {
    myState.isGubbins = RawDataStore.getGenomicDatasetType() === 'gubbins';
    myState.raw_blocks = RawDataStore.getParsedData('genomic')[1];
    myState.redraw();
  };
  window.addEventListener('resize', function () {myState.redraw();}, true);
  // TO FIX
  Actions.set_genome_length(RawDataStore.getParsedData('genomic')[0][1]);

  this.redraw = function () {
     // redraws are expensive. We need to work out if we redraw.
    // we only redraw if  * viewport (visibleGenome) has changed <- taken care of in the store
     //             * click has selected / deseleced a block (myState.selected_block) <-
    //            * TaxaLocations have changed (i.e. y values are different) <-- this is taken care of in the store
    // is anything actually loaded?
    if (myState.raw_blocks === undefined) {return false;}
    // trimBlocks() will limit blocks to our viewport and also associate the x and y values in pixels
    const visibleGenome = GenomeStore.getVisible();
    // console.log("DRAW GUBBINS over visibleGenome",visibleGenome)
    blocks = trimBlocks(myState.raw_blocks, visibleGenome, myState.canvas);
    // console.log('visibleGenome',visibleGenome)
    draw.clearCanvas(myState.canvas);
    // console.log(GenomeStore.getSelectedTaxaY())
    draw.highlightSelectedNodes(myState.canvas, myState.context, GenomeStore.getSelectedTaxaY(), true);
    // check selected_block (if any) is still in view
    if (
      myState.selected_block !== undefined
      &&
      (myState.selected_block.end_base < visibleGenome[0] || myState.selected_block.start_base > visibleGenome[1])
    ) {
      myState.selected_block = undefined;
    }
    if (myState.selected_block !== undefined) {
      draw.highlightSelectedNodes(myState.canvas, myState.context, [ myState.selected_block.x1, myState.selected_block.x2 ], false);
    }
    draw.drawBlocks(myState.context, blocks);
    // annotation last --> on top
    if (myState.selected_block !== undefined && myState.isGubbins) {
      draw.displayBlockInfo(myState.context, myState.selected_block);
    }
  };

  this.checkForClick = function () {
    if (RegionSelectedStore.getID() === canvas.id) {
      // console.log("Click taken by gubbins")
      const newSelectedBlock = getSelectedBlock(blocks, RegionSelectedStore.getClickXY());
      if (
        (myState.selected_block === undefined && newSelectedBlock !== undefined ) ||
        (myState.selected_block !== undefined && newSelectedBlock === undefined ) ||
        ((myState.selected_block !== undefined && newSelectedBlock !== undefined) && myState.selected_block.id !== newSelectedBlock.id )
        ) {
        myState.selected_block = newSelectedBlock;
        // console.log('selected block:', myState.selected_block);
        myState.redraw(); // will pick up the block :)
      }
    }
  };

  // whenever the Taxa_locations store changes (e.g. someones done something to the tree)
  // we should re-draw
  TaxaLocations.addChangeListener(this.redraw);

  // likewise, whenever anybody changes the genome-position of the viewport, we should re-draw
  GenomeStore.addChangeListener(this.redraw);

  // clicks
  RegionSelectedStore.addChangeListener(this.checkForClick);

  MiscStore.addChangeListener(this.redraw);

  RawDataStore.addChangeListener(this.loadRawData);

  this.loadRawData(); // forces this.redraw()
}

function getSelectedBlock(blocks, mouse) {
  // console.log(mouse)
  for (let i = 0; i < blocks.length; i++) {
    // console.log(blocks[i])
    if ( mouse[0] >= blocks[i].x1 && mouse[0] <= blocks[i].x2 && mouse[1] >= blocks[i].y1 && mouse[1] <= blocks[i].y2) {
      return blocks[i];
    }
  }
  return undefined;
}

module.exports = gubbins;

