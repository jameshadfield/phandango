import React from 'react';
import { Mouse } from '../misc/mouse';
import * as helper from '../misc/helperFunctions';

/*
  The Blocks component
  Draws gubbins / roary e.t.c
*/
export const Blocks = React.createClass({
  propTypes: {
    visibleGenome: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
    dispatch: React.PropTypes.func.isRequired,
    data: React.PropTypes.array.isRequired,
    style: React.PropTypes.object.isRequired,
    activeTaxa: React.PropTypes.object.isRequired,
  },

  getInitialState: function () {
    return ({ selected: undefined });
  },

  componentDidMount: function () { // don't use fat arrow
    this.initCanvasXY();
    this.mouse = new Mouse(this.canvas, this.props.dispatch, this.onClickCallback); // set up listeners
    this.selected = undefined; // selected arrow (gene)
    this.redraw(this.props);
  },

  shouldComponentUpdate() {
    return true;
  },

  componentWillUpdate(props) {
    this.redraw(props);
  },

  render() {
    return (
      <div>
        <canvas
          id="Blocks"
          ref={(c) => this.canvas = c}
          style={this.props.style}
        />
      </div>
    );
  },

  redraw: function (props) {
    // expensive way to handle resizing
    this.initCanvasXY();
    const context = this.canvas.getContext('2d');
    const blocks = computeBlocksInView(props.data, props.visibleGenome, this.canvas, props.activeTaxa);
    this.clearCanvas();
    // draw.highlightSelectedNodes(myState.canvas, myState.context, GenomeStore.getSelectedTaxaY(), true);
    // // check selected_block (if any) is still in view
    // if (
    //   myState.selected_block !== undefined
    //   &&
    //   (myState.selected_block.end_base < visibleGenome[0] || myState.selected_block.start_base > visibleGenome[1])
    // ) {
    //   myState.selected_block = undefined;
    // }
    // if (myState.selected_block !== undefined) {
    //   draw.highlightSelectedNodes(myState.canvas, myState.context, [ myState.selected_block.x1, myState.selected_block.x2 ], false);
    // }
    drawBlocks(context, blocks);
  },

  // onClickCallback(mx, my) {
  //   // we can dispatch here as well if necessary!
  //   this.setState({
  //     selected: getClicked(mx, my, this.props.data, this.props.visibleGenome, this.canvas),
  //   });
  // },

  // by specifying the funtions here
  // react auto-binds 'this'
  // and it also allows changes in these functions
  // to be hot-reloaded
  initCanvasXY: helper.initCanvasXY,
  clearCanvas: helper.clearCanvas,
});


// function getClicked(mx, my, data, visibleGenome, canvas) {
//   const currentArrows = getArrowsInScope(data, visibleGenome, canvas);
//   for (let i = 0; i < currentArrows.length; i++) {
//     if (
//       mx >= currentArrows[i].x &&
//       mx <= (currentArrows[i].x + currentArrows[i].w) &&
//       my >= currentArrows[i].y &&
//       my <= (currentArrows[i].y + currentArrows[i].h)
//       ) {
//       return currentArrows[i];
//     }
//   }
//   // nothing selected! (fallthrough)
//   return undefined;
// }


function drawBlocks(context, blocks) {
  for (let i = 0; i < blocks.length; i++) {
    context.save();
    // context.beginPath() // does what?
    context.fillStyle = blocks[i].fill;
    context.globalAlpha = 0.3;
    context.fillRect(blocks[i].x1, blocks[i].y1, blocks[i].x2 - blocks[i].x1, blocks[i].y2 - blocks[i].y1);
    context.restore();
  }
}

// function drawBorderAndText(context, arrow, middleCanvasWidth, scaleYvalue) {
//   context.strokeStyle = '#CC302E';
//   context.lineWidth = 2;

//   context.beginPath();
//   context.moveTo(arrow.coordinates[0][0], arrow.coordinates[0][1]);
//   for (let j = 0; j < arrow.coordinates.length; j++) {
//     context.lineTo(arrow.coordinates[j][0], arrow.coordinates[j][1]);
//   }
//   context.closePath();
//   context.stroke();
//   // TEXT
//   context.fillStyle = 'black';
//   context.textBaseline = 'middle';
//   context.textAlign = 'center';
//   context.font = '12px Helvetica';
//   const text = arrow.locus_tag + ' // ' + arrow.product;
//   context.fillText(text, middleCanvasWidth, scaleYvalue - 40);
//   // context.fillText(arrow.ID, arrow.x+(arrow.w/2), scaleYvalue-69);
//   // context.fillText(arrow.locus_tag, arrow.x+(arrow.w/2), scaleYvalue-52);
//   // context.fillText(arrow.product, arrow.x+(arrow.w/2), scaleYvalue-35);
// }


/*      computeYValuesForTaxa
taxaList: list of taxa belonging to a block (e.g.)
activeTaxa: object with keys: taxa, values: [top,bottom]
*/
function computeYValuesForTaxa(taxaList, activeTaxa) {
  let ret;
  const checkedTaxaList = [];
  for (let i = 0; i < taxaList.length; i++) {
    if (taxaList[i] in activeTaxa) {
      checkedTaxaList.push(taxaList[i]);
    }
  }
  if (checkedTaxaList.length === 0) {
    ret = false;
  } else if (checkedTaxaList.length === 1) {
    ret = activeTaxa[checkedTaxaList[0]];
  } else {
    let min = activeTaxa[checkedTaxaList[0]][0];
    let max = activeTaxa[checkedTaxaList[0]][1];
    for (let i = 1; i < checkedTaxaList.length; i++) {
      if (activeTaxa[checkedTaxaList[i]][1] > max) {
        max = activeTaxa[checkedTaxaList[i]][1];
      } else if (activeTaxa[checkedTaxaList[i]][0] < min) {
        min = activeTaxa[checkedTaxaList[i]][0];
      }
    }
    ret = [ min, max ];
  }
  return ret;
}

/*        computeBlocksInView
@params@ rawBlocks: list of all Blocks
@returns@ smaller list of Blocks that are in view with
          y values and x values (relative to current view) set
*/
function computeBlocksInView(rawBlocks, visibleGenomeCoords, canvas, activeTaxa) {
  const basesVisible = visibleGenomeCoords[1] - visibleGenomeCoords[0];
  const trimmedBlocks = [];

  for (let i = 0; i < rawBlocks.length; i++) {
    // check if in view here
    if (rawBlocks[i].start_base >= visibleGenomeCoords[1] || rawBlocks[i].end_base <= visibleGenomeCoords[0]) {
      continue;
    }
    let anyTaxaInView = false;
    for (let j = 0; j < rawBlocks[i].taxa.length; j++) {
      if (rawBlocks[i].taxa[j] in activeTaxa) {
        anyTaxaInView = true;
        break;
      }
    }
    if (anyTaxaInView === false) {continue;}

    const newBlock = rawBlocks[i]; // pass by reference
    newBlock.x1 = parseInt( (newBlock.start_base - visibleGenomeCoords[0]) / basesVisible * canvas.width, 10);
    newBlock.x2 = parseInt( (newBlock.end_base - visibleGenomeCoords[0])  / basesVisible * canvas.width, 10);

    // how many pixels?  if 2 or 1 or 0 then don't bother
    // if ((newBlock.x2 - newBlock.x1) <= 2) {continue;}

    // now get the y-values (from state)
    const tmp = computeYValuesForTaxa(newBlock.taxa, activeTaxa);
    if (!tmp) {
      continue;
    }
    newBlock.y1 = tmp[0];
    newBlock.y2 = tmp[1];
    trimmedBlocks.push(newBlock);
  }
  return (trimmedBlocks);
}


