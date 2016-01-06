import React from 'react';
import { Mouse, getMouse } from '../misc/mouse';
import * as helper from '../misc/helperFunctions';
import { InfoTip } from './infoTip';


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
    return ({ selected: undefined, hovered: undefined });
  },

  componentDidMount: function () { // don't use fat arrow
    this.initCanvasXY();
    this.mouse = new Mouse(this.canvas, this.props.dispatch, this.onClickCallback); // set up listeners
    this.canvas.addEventListener('mousemove', this.onMouseMove, true);
    this.canvas.addEventListener('mouseout',
      () => {this.setState({ hovered: undefined });},
      true);
    this.redraw(this.props, this.state);
  },

  shouldComponentUpdate() {
    return true;
  },

  componentWillUpdate(props, state) {
    this.canvasPos = this.canvas.getBoundingClientRect();
    this.redraw(props, state);
  },

  render() {
    const selected = [];
    // if (this.state.selected) {
    //   selected.push({
    //     x: this.getXYOfBlock(this.state.selected)[0],
    //     y: this.getXYOfBlock(this.state.selected)[1],
    //     disp: {
    //       'n(SNPs)': this.state.selected.snps,
    //       'n(taxa)': this.state.selected.nTaxa,
    //       nll: parseInt(this.state.selected.nll, 10),
    //     },
    //   });
    // }
    if (this.state.hovered) {
      selected.push({
        x: this.getXYOfBlock(this.state.hovered)[0],
        y: this.getXYOfBlock(this.state.hovered)[1],
        disp: {
          'n(SNPs)': this.state.hovered.snps,
          'n(taxa)': this.state.hovered.nTaxa,
          nll: parseInt(this.state.hovered.nll, 10),
        },
      });
    }
    return (
      <div>
        <canvas
          id="Blocks"
          ref={(c) => this.canvas = c}
          style={this.props.style}
        />
        {selected.map((cv, idx) =>
          <InfoTip key={idx} disp={cv.disp} x={cv.x} y={cv.y} />
        )}
      </div>
    );
  },

  redraw: function (props, state) {
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
    //   (myState.selected_block.endBase < visibleGenome[0] || myState.selected_block.startBase > visibleGenome[1])
    // ) {
    //   myState.selected_block = undefined;
    // }
    // if (myState.selected_block !== undefined) {
    //   draw.highlightSelectedNodes(myState.canvas, myState.context, [ myState.selected_block.x1, myState.selected_block.x2 ], false);
    // }
    drawBlocks(context, blocks);
    // if (state.selected) {
      // this.drawBorder(context, state.selected, 'black');
    // }
    if (state.hovered) {
      this.drawBorder(context, state.hovered, 'purple');
    }
  },

  onClickCallback(mx, my) {
    // we can dispatch here as well if necessary!
    this.setState({
      selected: this.findSelected(mx, my),
    });
  },

  onMouseMove(e) {
    const mouse = getMouse(e, this.canvas);
    this.setState({
      hovered: this.findSelected(mouse.x, mouse.y),
    });
  },

  // by specifying the funtions here
  // react auto-binds 'this'
  // and it also allows changes in these functions
  // to be hot-reloaded
  initCanvasXY: helper.initCanvasXY,
  clearCanvas: helper.clearCanvas,

  getXYOfBlock(block) {
    return ([
      parseInt( (block.x2) + this.canvasPos.left, 10),
      parseInt( block.y2 + this.canvasPos.top + 5, 10),
    ]);
  },


  findSelected(mx, my) {
    const blocks = computeBlocksInView(this.props.data, this.props.visibleGenome, this.canvas, this.props.activeTaxa);
    for (let idx = 0; idx < blocks.length; idx++) {
      if (
        mx >= blocks[idx].x1 &&
        mx <= (blocks[idx].x2) &&
        my >= blocks[idx].y1 &&
        my <= (blocks[idx].y2)
        ) {
        return (
          {
            x1: blocks[idx].x1,
            x2: blocks[idx].x2,
            y1: blocks[idx].y1,
            y2: blocks[idx].y2,
            nll: blocks[idx].nll,
            nTaxa: blocks[idx].taxa.length,
            snps: blocks[idx].snps,
          }
        );
        // blocks[idx]; // reference
      }
    }
    // nothing selected! (fallthrough)
    return undefined;
  },

  drawBorder(context, block, colour, width = 2) {
    context.strokeStyle = colour;
    context.lineWidth = width;
    context.beginPath();
    context.lineTo(block.x1, block.y1);
    context.lineTo(block.x1, block.y2);
    context.lineTo(block.x2, block.y2);
    context.lineTo(block.x2, block.y1);
    context.lineTo(block.x1, block.y1);
    context.closePath();
    context.stroke();
  },

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

function drawBlocks(context, blocks, alpha = 0.3) {
  for (let i = 0; i < blocks.length; i++) {
    context.save();
    // context.beginPath() // does what?
    context.fillStyle = blocks[i].fill;
    context.globalAlpha = alpha;
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
    if (rawBlocks[i].startBase >= visibleGenomeCoords[1] || rawBlocks[i].endBase <= visibleGenomeCoords[0]) {
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
    newBlock.x1 = parseInt( (newBlock.startBase - visibleGenomeCoords[0]) / basesVisible * canvas.width, 10);
    newBlock.x2 = parseInt( (newBlock.endBase - visibleGenomeCoords[0])  / basesVisible * canvas.width, 10);

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


