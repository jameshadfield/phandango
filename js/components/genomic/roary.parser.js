const gubbinsParser = require('./parse.gubbins.js');
const gffParser = require('../annotation/parse.annotations.js');


function parseCSV(gffString) {
  // header is an array of hashes with different keys (gene name, genomic region, genomic number)
  // this header can be sorted (e.g. by region then number) to produce an array of indexes (of the array)
  // each region has a set number of pixels
  // parse the CSV such that hash.laneName = [binary]
  // now when we call up the draw function we just crawl the array (for each taxa) along (adding 10px to the draw call)
  // and we traverse this array by the index array already generated
  // if 1 then set x1 or +10 to x1
  // if 0 then draw if in cache or +10 to pixel count

  // the gff parsing uses Arrow from parse.annotations.js
  // we create the arrow from crawling the generated index and making arrows out of each one (adding 10px to each)
  //

  // columns:
  // [0] gene name
  // [2] annotation
  // [6] genome fragment
  // [7] order within fragment
  // [11-...] genes

  // var splitLines = gffString.split("\n").map(function(x){return x.replace(/"/g, '').trim().split(',')})
  let splitLines = gffString.split('\n').map(function (x) {
    return x.trim().split('","').map(function (y) {
      return y.replace(/"/g, '');
    });
  });

  // is it really ROARY data (this isn't foolproof!)
  if (splitLines[0][0] !== 'Gene') {
    return false;
  }

  // remove the last lines
  splitLines = splitLines.slice(0, -1);

  const maxColIdx = splitLines[0].length;
  const maxRowIdx = splitLines.length;
  // note that they're not all the same length due to CSV parsing difficulties (the last columns dissapear if empty etc)


  // H E A D E R
  const header = [];
  for (let i = 1; i < maxRowIdx; i++) {
    header.push({
      'annotation': splitLines[i][2],
      'name': splitLines[i][0],
      'fragment': splitLines[i][6],
      'order': splitLines[i][7],
    });
  }

  // P O P U L A T E    H A S H
  const roary = {};
  for (let colNum = 11; colNum < maxColIdx; colNum++) {
    const taxaName = splitLines[0][colNum];
    roary[taxaName] = []; // will be populated with binary
    for (let rowNum = 1; rowNum < maxRowIdx; rowNum++) {
      roary[taxaName].push(splitLines[rowNum][colNum] ? 1 : 0); // seems to catch everything... i think
    }
  }
  return ([ header, roary ]);
}

function generateRoary(header, roary, geneLen, sortCase) {
  const orderedIdx = sortHeader(header, sortCase);
  const blocks = makeBlocks(roary, geneLen, orderedIdx);
  const arrows = makeAnnotation(header, geneLen, orderedIdx);
  const genomeLength = geneLen * header.length;
  const yValues = generateYValues(blocks, genomeLength);
  return ([ blocks, arrows, genomeLength, yValues ]);
}

function sortHeader(header, sortCase) {
  // returns arroy of indicies which we use to process
  // currently hardcoded to sort into fragments
  const len = header.length;
  const indices = new Array(len);
  for (let i = 0; i < len; ++i) indices[i] = i;

  switch (sortCase) {
  case 'asIs':
    break;
  case 'fragments':
    // fragment then order
    indices.sort(function (a, b) { // a,b are indices in this case!
      if (header[a].fragment === header[b].fragment) {
        return parseInt(header[a].order, 10) < parseInt(header[b].order, 10) ? -1 : 1;
      } else {
        return parseInt(header[a].fragment, 10) < parseInt(header[b].fragment, 10) ? -1 : 1;
      }
    });
    break;
  }
  return indices;
}

function makeBlocks(roary, geneLen, orderedIdx) {
  const ret = [];
  const maxIdx = orderedIdx.length;
  Object.keys(roary).forEach( function (taxa) {
    // console.log("key of roary: ",taxa)
    let inBlock = false;
    let blockOpen = 0;
    let xPos = 0;
    for (let i = 0; i < orderedIdx.length - 1; i++) {
      const idx = orderedIdx[i];
      if (roary[taxa][idx]) { // i.e. gene "present"
        if (!inBlock) { // but we wern't in a block --> open one
          inBlock = true;
          blockOpen = xPos;
        } // else we were in a block --> extend the block (nothing needed)
      } else { // gene not present
        if (inBlock) { // we were in a block --> close (create) block
          inBlock = false;
          // new Block(start_base, end_base, taxa, node, nll, snps, id)
          ret.push(new gubbinsParser.Block(blockOpen, xPos, [ taxa ], 0, 0, 0, 0));
        }
        // else we wern't in a block anyway so nothing changes
      }
      xPos += geneLen; // basically a counter
    }
    // final case (idx = end of orderedIdx)
    if (roary[taxa][orderedIdx[maxIdx - 1]] && inBlock) { // still in block
      ret.push(new gubbinsParser.Block(blockOpen, xPos + geneLen, [ taxa ], 0, 0, 0, 0));
    } else if (roary[taxa][orderedIdx[maxIdx - 1]] && !inBlock) { // wern't in block but now are
      ret.push(new gubbinsParser.Block(xPos, xPos + geneLen, [ taxa ], 0, 0, 0, 0));
    } else if (!roary[taxa][orderedIdx[maxIdx - 1]] && inBlock) { // were in block but now arent
      ret.push(new gubbinsParser.Block(blockOpen, xPos, [ taxa ], 0, 0, 0, 0));
    }
  } );
  return (ret);
}

function generateYValues(blocks, genomeLength) {
  const plotYvalues = [];
  for (let i = 0; i < genomeLength; i++) { plotYvalues.push(0); }
  // each block change plotYvalues :)
  for (let i = 0; i < blocks.length; i++) {
    for (let j = blocks[i].start_base; j <= blocks[i].end_base; j++) {
      plotYvalues[j] += 1;
    }
  }
  return plotYvalues;
}


function makeAnnotation(header, geneLen, orderedIdx) {
  const ret = [];
  let info;
  // adding fragment by fragment (+ strand)
  let currentFragment = header[orderedIdx[0]].fragment;
  let fragmentOpen = 0;
  for (let i = 1; i < orderedIdx.length; i++) {
    const idx = orderedIdx[i];

    // F R A G M E N T S
    if (currentFragment !== header[idx].fragment || idx + 1 === header.length) { // save as a block :)
      // console.log("fragment change. FROM ",currentFragment,"TO",header[idx].fragment,"AT",(i+1)*geneLen)
      info = 'locus_tag=fragment ' + currentFragment + ';';
      ret.push(new gffParser.Arrow(
        fragmentOpen,
        (i + 1) * geneLen,
        '+',
        currentFragment % 2 === 0 ? '#FFCC00' : '#FF9900',
        'black',
        2,
        info
      ));
      fragmentOpen = (i + 1) * geneLen;
      currentFragment = header[idx].fragment;
    }

    // G E N E S
    info = 'locus_tag=' + header[idx].name + ';product=' + header[idx].annotation;
    ret.push(new gffParser.Arrow(i * geneLen, (i + 1) * geneLen, '-', '#318DCC', 'black', 1, info));
  }

  return ret;
}

module.exports = {
  parseCSV: parseCSV,
  generateRoary: generateRoary,
};
