import React from 'react';
import PropTypes from 'prop-types';
import { Mouse, getMouse } from '../misc/mouse';
import * as helper from '../misc/helperFunctions';
import { InfoTip } from './infoTip';


/*
  The Blocks component
  Draws gubbins / roary e.t.c
*/
export class Blocks extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = { selected: undefined, hovered: undefined };

    this.onClickCallback = (mx, my) => {
      // we can dispatch here as well if necessary!
      this.setState({
        selected: this.findSelected(mx, my),
      });
    };

    this.onMouseMove = (e) => {
      const mouse = getMouse(e, this.canvas);
      this.setState({
        hovered: this.findSelected(mouse.x, mouse.y),
      });
    };

    this.getXYOfBlock = (block) => {
      return ([
        parseInt( (block.x2) + this.canvasPos.left, 10),
        parseInt( block.y2 + this.canvasPos.top + 5, 10),
      ]);
    };

    this.resizeFn = () => {this.forceUpdate();};

    this.svgdraw = () => {
      this.canvasPos = this.canvas.getBoundingClientRect();
      console.log('printing blocks to SVG');
      window.svgCtx.save();
      const currentWidth = window.svgCtx.width;
      window.svgCtx.width = this.canvas.width;
      window.svgCtx.translate(this.canvasPos.left, this.canvasPos.top);
      window.svgCtx.rect(0, 0, this.canvasPos.right - this.canvasPos.left, this.canvasPos.bottom - this.canvasPos.top);
      window.svgCtx.stroke();
      window.svgCtx.clip();
      this.redraw(window.svgCtx, this.props, this.state);
      window.svgCtx.restore();
      window.svgCtx.width = currentWidth;
    };

    this.redraw = (context, props, state) => {
      const blocks = computeBlocksInView(props.data, props.visibleGenome, this.canvas, props.activeTaxa, props.blocksArePerTaxa);
      drawBlocks(context, blocks, props.blockFillAlpha);
      if (state.hovered) {
        this.drawBorder(context, state.hovered, 'purple');
      }
    };

    this.initCanvasXY = helper.initCanvasXY;
    this.clearCanvas = helper.clearCanvas;

    this.findSelected = (mx, my) => {
      const blocks = computeBlocksInView(this.props.data, this.props.visibleGenome, this.canvas, this.props.activeTaxa);
      for (let idx = 0; idx < blocks.length; idx++) {
        if (
          mx >= blocks[idx].x1 &&
          mx <= (blocks[idx].x2) &&
          my >= blocks[idx].y1 &&
          my <= (blocks[idx].y2)
          ) {
          // return ({
          //   x1: blocks[idx].x1,
          //   x2: blocks[idx].x2,
          //   y1: blocks[idx].y1,
          //   y2: blocks[idx].y2,
          //   info: blocks[idx].info,
          // });
          return (blocks[idx]); // reference
        }
      }
      // nothing selected! (fallthrough)
      return undefined;
    };

    this.drawBorder = (context, block, colour, width = 2) => {
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
    };
  }

  componentDidMount() {
    this.initCanvasXY();
    this.mouse = new Mouse(this.canvas, this.props.dispatch, this.onClickCallback); // set up listeners
    // mouse-overs only make sense for gubbins data!
    // this code must be expanded into component will update!
    if (this.props.shouldMouseOver) {
      this.canvas.addEventListener('mousemove', this.onMouseMove, true);
      this.canvas.addEventListener('mouseout',
        () => {this.setState({ hovered: undefined });},
        true);
    }
    this.redraw(this.canvas.getContext('2d'), this.props, this.state);
    window.addEventListener('pdf', this.svgdraw, false);
    window.addEventListener('resize', this.resizeFn, false);
  }

  componentWillUpdate(props, state) {
    this.initCanvasXY();
    this.clearCanvas();
    this.canvasPos = this.canvas.getBoundingClientRect();
    this.redraw(this.canvas.getContext('2d'), props, state);
  }

  componentWillUnmount() {
    window.removeEventListener('pdf', this.svgdraw, false);
    window.removeEventListener('resize', this.resizeFn, false);
  }

  render() {
    // console.log('blocks render');
    const blocksToDisplayInfo = [];
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
      blocksToDisplayInfo.push({
        x: this.getXYOfBlock(this.state.hovered)[0],
        y: this.getXYOfBlock(this.state.hovered)[1],
        disp: this.state.hovered.info,
      });
    }
    return (
      <div>
        <canvas
          id="Blocks"
          ref={(c) => {this.canvas = c;}}
          style={this.props.style}
        />
        {blocksToDisplayInfo.map((cv, idx) =>
          <InfoTip key={idx} disp={cv.disp} x={cv.x} y={cv.y} />
        )}
      </div>
    );
  }
}

Blocks.propTypes = {
  visibleGenome: PropTypes.arrayOf(PropTypes.number).isRequired,
  dispatch: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]).isRequired,
  style: PropTypes.object.isRequired,
  activeTaxa: PropTypes.object.isRequired,
  shouldMouseOver: PropTypes.bool.isRequired,
  blocksArePerTaxa: PropTypes.bool.isRequired,
  blockFillAlpha: PropTypes.number.isRequired,
};

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

function drawBlocks(context, blocks, alpha) {
  context.globalAlpha = alpha;
  context.save();
  for (let i = 0; i < blocks.length; i++) {
    context.fillStyle = blocks[i].fill;
    context.beginPath(); // does what?
    // context.rect(blocks[i].x1, blocks[i].y1, blocks[i].x2 - blocks[i].x1, blocks[i].y2 - blocks[i].y1);
    context.fillRect(blocks[i].x1, blocks[i].y1, blocks[i].x2 - blocks[i].x1, blocks[i].y2 - blocks[i].y1);
    // context.fill();
  }
  context.restore();
  context.globalAlpha = 1;
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
@params@ rawBlocks: list of all Blocks OR object whos keys are arrays (and the key is the taxa!)
@params@ blocksArePerTaxa {bool} - identifies the type of rawBlocks (true -> object, false -> array)
@returns@ smaller list of Blocks that are in view with
          y values and x values (relative to current view) set
          This is ALWAYS an array
*/
function computeBlocksInView(rawBlocks, visibleGenomeCoords, canvas, activeTaxa, blocksArePerTaxa) {
  const basesVisible = visibleGenomeCoords[1] - visibleGenomeCoords[0];
  const trimmedBlocks = [];
  const canvasWidth = canvas.width;

  // if it's an object of arrays then...
  if (blocksArePerTaxa) {
    for (const taxa of Object.keys(rawBlocks)) {
      const yPx = activeTaxa[taxa]; // yPx = [min, max]
      if (!yPx) { // i.e. this whole array of blocks isn't in view
        continue;
      }
      for (const block of rawBlocks[taxa]) {
        // check if it's in view!
        if (block.startBase >= visibleGenomeCoords[1] || block.endBase <= visibleGenomeCoords[0]) {
          continue;
        }
        // if we are here then it's in view... calculate values!
        const newBlock = block; // pass by reference
        newBlock.x1 = parseInt( (newBlock.startBase - visibleGenomeCoords[0]) / basesVisible * canvas.width, 10);
        newBlock.x2 = parseInt( (newBlock.endBase - visibleGenomeCoords[0])  / basesVisible * canvas.width, 10);
        newBlock.y1 = yPx[0];
        newBlock.y2 = yPx[1];

        if (newBlock.x1 < 0) {
          newBlock.x1 = 0;
        }
        if (newBlock.x2 > canvasWidth) {
          newBlock.x2 = canvasWidth;
        }

        trimmedBlocks.push(newBlock);
      }
    }
  } else { // it's an array of blocks each defining a taxa (e.g. gubbins)
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

      if (newBlock.x1 < 0) {
        newBlock.x1 = 0;
      }
      if (newBlock.x2 > canvasWidth) {
        newBlock.x2 = canvasWidth;
      }

      // how many pixels?  if 2 or 1 or 0 then don't bother
      // if ((newBlock.x2 - newBlock.x1) <= 2) {continue;}

      // now get the y-values
      // if it's a list of taxa this works:
      const tmp = computeYValuesForTaxa(newBlock.taxa, activeTaxa);
      if (!tmp) {
        continue;
      }
      newBlock.y1 = tmp[0];
      newBlock.y2 = tmp[1];
      trimmedBlocks.push(newBlock);
    }
  }
  return (trimmedBlocks);
}
