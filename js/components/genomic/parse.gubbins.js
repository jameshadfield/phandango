const Actions = require('../../actions/actions.js');
// This module exports the parse_gff function
// at the moment it reads a hardcoded gff

// Block: this is an object / container contstructor
function Block(startBase, endBase, taxa, node, nll, snps, id) {
  // This is a very simple and unsafe constructor.
  // All we're doing is checking if the values exist.
  // if this.node is false then it's a leaf (croucher's version would display blue)
  this.start_base = startBase;
  this.end_base = endBase;
  this.taxa = taxa;
  this.node = node;
  this.nll = nll; // neg-log-likelihood
  this.snps = snps;
  if (this.node) {
    this.fill = 'red'; // you can change this with another function
  } else {
    this.fill = 'blue';
  }
  this.fillAlpha = 1;
  // the following are measured in pixels relative to the canvas (and therefore unknown at the moment)
  this.x1 = 0;
  this.x2 = 0;
  this.y1 = 0;
  this.y2 = 0;
  this.id = id; // unique ID
}


// helper function: parses gubbins gff file and returns a list of Blocks by taxa ID
// we MUST think of a clever-er way of doing this, but this is the most basic (and stupid)
// if we make this a bunch of call-backs, can we stop the browser from blocking?
// Or is this so fast that we don't need to bother?
function parseGff(gffString) {
  // console.log("*** gubbins gff parser called ****")
  let genomeCoords = null;
  const lines = gffString.split('\n'); // TO DO
  const blocks = [];

  for (let i = 0; i < lines.length; i++) {
    const words = lines[i].split('\t');
    if (words[0][0] === '#') {
      const hwords = words[0].split(' ');
      if (hwords[0] === '##sequence-region') {
        genomeCoords = [ parseInt(hwords[2], 10) - 1, parseInt(hwords[3], 10) ];
      }
    } else {
      if (words[1] === 'GUBBINS') {
        // next few lines, replace lines[i] with words[10] ???
        const taxa = lines[i].split('taxa=\"')[1].split('\"')[0].split(/\s+/).filter(Boolean);
        let node;
        if (taxa.length > 1) {
          node = lines[i].split('node=\"')[1].split('\"')[0].split('->');
        } else {
          node = false;
        }
        const nll = lines[i].split('neg_log_likelihood=\"')[1].split('\"')[0];
        const numSnps =  lines[i].split('snp_count=\"')[1].split('\"')[0];
        blocks.push(
          new Block( // start_base, end_base, taxa, node, nll, snps, uniq_ID
            words[3], words[4], taxa, node, nll, numSnps, i
            )
          );
      }
    }
  }

  let ret = false;
  if (blocks.length > 0) {
    const plotYvalues = blocksToLineGraphData(blocks, genomeCoords[1], false);
    Actions.save_plotYvalues(plotYvalues, 'recombGraph');
    ret = [ genomeCoords, blocks ];
  }
  return (ret);
}

function blocksToLineGraphData(blocks, genomeLength, selectedTaxa) {
  //       Y    V A L U E S    (for plotting)
  // the following can be a setTimeout i think...
  // selectedTaxa = False -> parse all blocks
  //                True  -> only blocks with taxa overlap!
  if (blocks.length > 0) {
    // console.log("STARTING PLOT CALC")
    // initialise array the correct length
    const plotYvalues = [];
    for (let i = 0; i < genomeLength; i++) {
      plotYvalues.push(0);
    }
    // each block change plotYvalues :)
    for (let i = 0; i < blocks.length; i++) {
      let useBlock = true;
      if (selectedTaxa) {
        useBlock = false;
        for (let j = 0; j < blocks[i].taxa.length; j++) {
          if (selectedTaxa.indexOf(blocks[i].taxa[j]) > -1) {
            useBlock = true;
            break;
          }
        }
      }
      if (useBlock) {
        for (let j = blocks[i].start_base; j <= blocks[i].end_base; j++) {
          plotYvalues[j] += 1;
        }
      }
    }
    // console.log("FINISHED PLOT CALC")
    return (plotYvalues);
  }
  return false;
}

module.exports = {
  parse_gff: parseGff,
  Block: Block,
  blocksToLineGraphData: blocksToLineGraphData,
};
