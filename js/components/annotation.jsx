import React from 'react';
import { Mouse, getMouse } from '../misc/mouse';
import * as helper from '../misc/helperFunctions';
import { InfoTip } from './infoTip';

/*
  The Annotation component
  The state here is to do with selected genes
    on a click - the "permanently displayed" gene is put into state
    on a mouseOver the "temporarily displayed" gene is put into state
*/
export const Annotation = React.createClass({
  propTypes: {
    visibleGenome: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
    dispatch: React.PropTypes.func.isRequired,
    data: React.PropTypes.array.isRequired,
    style: React.PropTypes.object.isRequired,
  },

  getInitialState: function () {
    return ({ geneSelected: undefined, geneHovered: undefined , contigSelected: undefined, contigHovered: undefined });
  },

  componentDidMount: function () {
    this.mouse = new Mouse(this.canvas, this.props.dispatch, this.onClickCallback); // set up listeners
    this.canvas.addEventListener('mousemove', this.onMouseMove, true);
    this.canvas.addEventListener('mouseout',
      () => {this.setState({ geneHovered: undefined });this.setState({ contigHovered: undefined })},
      true);
    // window.addEventListener('pdf', this.pdfdraw, false);
    window.addEventListener('pdf', this.svgdraw, false);
    this.forceUpdate();
  },

  shouldComponentUpdate() {
    return true;
  },

  componentWillUpdate(props, state) {
    this.canvasPos = this.canvas.getBoundingClientRect();
    this.initCanvasXY();
    this.clearCanvas();
    this.redraw(props, state);
  },

  onMouseMove(e) {
    const mouse = getMouse(e, this.canvas);
    this.setState({
      geneHovered: getClicked(mouse.x, mouse.y, this.props.data[0], this.props.visibleGenome, this.canvas),
    });
    this.setState({
      contigHovered: getClicked(mouse.x, mouse.y, this.props.data[1], this.props.visibleGenome, this.canvas, true),
    });
  },

  onClickCallback(mx, my) {
    this.setState({
      geneSelected: getClicked(mx, my, this.props.data[0], this.props.visibleGenome, this.canvas),
    });
    this.setState({
      contigSelected: getClicked(mx, my, this.props.data[1], this.props.visibleGenome, this.canvas, true),
    });
  },

  /* given an arrow, what are the x or y position to display the annotation at */
  getXYOfSelectedGene(arrow, xy) {
    let ret;
    /* position at actual gene via: */
    if (xy) { // xy=1 ==> y co-ordinate
      ret = parseInt( arrow.coordinates[1][xy] + 5 + this.canvasPos.top, 10);
    } else {
      ret = parseInt( (arrow.coordinates[0][xy] + arrow.coordinates[2][xy]) / 2 + this.canvasPos.left, 10);
    }
    /* fixed (LHS) */
    // if (xy) { // xy=1 ==> y co-ordinate
    //   ret = parseInt( this.canvasPos.bottom - 30, 10);
    // } else {
    //   ret = parseInt(this.canvasPos.left + 10, 10);
    // }
    return ret;
  },

  infoUniqKey: 0,
  render() {
    const genes = [];
    const contigs = [];
    if (this.state.geneSelected) {
      genes.push({
        x: this.getXYOfSelectedGene(this.state.geneSelected, 0),
        y: this.getXYOfSelectedGene(this.state.geneSelected, 1),
        // disp: {
        //   locusTag: this.state.geneSelected.locus_tag,
        //   product: this.state.geneSelected.product,
        // },
        disp: this.state.geneSelected.fields,
      });
    }
    if (this.state.geneHovered) {
      genes.push({
        x: this.getXYOfSelectedGene(this.state.geneHovered, 0),
        y: this.getXYOfSelectedGene(this.state.geneHovered, 1),
        disp: this.state.geneHovered.fields,
      });
    }
    if (this.state.contigSelected) {
      contigs.push({
        x: this.getXYOfSelectedGene(this.state.contigSelected, 0),
        y: this.getXYOfSelectedGene(this.state.contigSelected, 1),
        disp: this.state.contigSelected.fields,
      });
    }
    if (this.state.contigHovered) {
      contigs.push({
        x: this.getXYOfSelectedGene(this.state.contigHovered, 0),
        y: this.getXYOfSelectedGene(this.state.contigHovered, 1),
        // disp: {
        //   locusTag: this.state.geneHovered.locus_tag,
        //   product: this.state.geneHovered.product,
        // },
        disp: this.state.contigHovered.fields,
      });
    }
    //if (contigs[0]) {console.log(contigs[0].disp)} else {console.log(contigs)}
    return (
      <div>
        <canvas
          id="GenomeAnnotation"
          ref={(c) => this.canvas = c}
          style={this.props.style}
        />
        {genes.map((cv, idx) =>
          <InfoTip key={++this.infoUniqKey + '_' + idx} disp={cv.disp} x={cv.x} y={cv.y} count={cv.count} />
        )}
        {contigs.map((cv, idx) =>
          <InfoTip key={++this.infoUniqKey + '_' + idx} disp={cv.disp} x={cv.x} y={cv.y} count={cv.count} />
        )}
      </div>
    );
  },

  initCanvasXY: helper.initCanvasXY,
  clearCanvas: helper.clearCanvas,

  svgdraw: function(){
    this.canvasPos = this.canvas.getBoundingClientRect();
    console.log("printing annotation");
    window.svgCtx.save();
    window.svgCtx.translate(this.canvasPos.left,this.canvasPos.top);
    window.svgCtx.rect(0, 0, this.canvasPos.right-this.canvasPos.left, this.canvasPos.bottom-this.canvasPos.top);
    window.svgCtx.clip();
    this.redraw(this.props, this.state, "svg");
    window.svgCtx.restore();
  },


  pdfdraw: function(){
    this.canvasPos = this.canvas.getBoundingClientRect();
    console.log("printing annotation");
    window.pdfdoc.save();
    window.pdfdoc.translate(this.canvasPos.left,this.canvasPos.top);
    window.pdfdoc.rect(0, 0, this.canvasPos.right-this.canvasPos.left, this.canvasPos.bottom-this.canvasPos.top);
    window.pdfdoc.clip();
    this.redraw(this.props, this.state, true);
    window.pdfdoc.restore();
  },


  redraw: function (props, state, pdfoutput=false) {
    
    let context = this.canvas.getContext('2d');
    if (pdfoutput===true){
      context=window.pdfdoc;
    }
    if (pdfoutput==="svg"){
      context=window.svgCtx;
    }

    this.clearCanvas();
    context.save();
    context.translate(0.5,0.5);

    const currentContigs = getArrowsInScope(props.data[1], props.visibleGenome, this.canvas, true);
    drawContigs(context, currentContigs, props.visibleGenome[1] - props.visibleGenome[0] < 100000, pdfoutput);
    const currentArrows = getArrowsInScope(props.data[0], props.visibleGenome, this.canvas);

    drawArrows(context, currentArrows, props.visibleGenome[1] - props.visibleGenome[0] < 100000, pdfoutput);
    drawScale(context, this.canvas.width, props.visibleGenome, parseInt(this.canvas.height / 2, 10), pdfoutput);

    if (state.geneSelected !== undefined) {
      if (getArrowsInScope([ state.geneSelected ], props.visibleGenome, this.canvas).length > 0) {
        drawBorder(context, state.geneSelected, 'red');
      }
    }
    if (state.geneHovered !== undefined) {
      drawBorder(context, state.geneHovered, 'purple');
    }
    if (state.contigSelected !== undefined) {
      if (getArrowsInScope([ state.contigSelected ], props.visibleGenome, this.canvas, true).length > 0) {
        drawBorder(context, state.contigSelected, 'red');
      }
    }
    if (state.contigHovered !== undefined) {
      drawBorder(context, state.contigHovered, 'purple');
    }
    context.restore();
  },

});

/* return the arrow which encompases mx, my */
function getClicked(mx, my, data, visibleGenome, canvas, isContig=false) {
  const currentArrows = getArrowsInScope(data, visibleGenome, canvas, isContig);

  for (let i = 0; i < currentArrows.length; i++) {
    if (
      mx >= currentArrows[i].x &&
      mx <= (currentArrows[i].x + currentArrows[i].w) &&
      my >= currentArrows[i].y &&
      my <= (currentArrows[i].y + currentArrows[i].h)
      ) {
      return currentArrows[i];
    }
  }
  // nothing selected! (fallthrough)
  return undefined;
}


function drawContigs(context, contigs, shouldDrawBorder, pdfoutput) {
  for (let i = 0; i < contigs.length; i++) {
    if (pdfoutput===true){
      context.fillColor(contigs[i].fill.toLowerCase());
      context.strokeColor(contigs[i].stroke.toLowerCase());
      //context.lineWidth(contigs[i].strokeWidth);
    }
    else{
      context.fillStyle = contigs[i].fill;
      context.strokeStyle = contigs[i].stroke;
      context.lineWidth = contigs[i].strokeWidth;
      context.beginPath();
    }

    //context.fillRect(contigs[i].x, contigs[i].y, contigs[i].w, contigs[i].h);
    
    context.moveTo(contigs[i].coordinates[0][0], contigs[i].coordinates[0][1]);
    for (let j = 1; j < contigs[i].coordinates.length; j++) {
      context.lineTo(contigs[i].coordinates[j][0], contigs[i].coordinates[j][1]);
    }
    if (pdfoutput===true){
      context.lineTo(contigs[i].coordinates[0][0], contigs[i].coordinates[0][1]);
      context.fill('non-zero');
    }
    else { 
      context.closePath();
    }
    if (shouldDrawBorder) {
      if (pdfoutput===true){
        //context.fillAndStroke();
        context.stroke();
      }
      else{
        context.stroke();
        context.fill();
      }
    }
    else{
      context.fill();
    }
  }
}


function drawArrows(context, arrows, shouldDrawBorder, pdfoutput) {
  for (let i = 0; i < arrows.length; i++) {
    if (pdfoutput===true){
      context.fillColor(arrows[i].fill.toLowerCase());
      context.strokeColor(arrows[i].stroke.toLowerCase());
      //context.lineWidth(arrows[i].strokeWidth);
    }
    else{
      context.fillStyle = arrows[i].fill;
      context.strokeStyle = arrows[i].stroke;
      context.lineWidth = arrows[i].strokeWidth;
      context.beginPath();
    }
    
    
    context.moveTo(arrows[i].coordinates[0][0], arrows[i].coordinates[0][1]);
    for (let j = 1; j < arrows[i].coordinates.length; j++) {
      context.lineTo(arrows[i].coordinates[j][0], arrows[i].coordinates[j][1]);
    }
    if (pdfoutput===true){
      context.lineTo(arrows[i].coordinates[0][0], arrows[i].coordinates[0][1]);
      context.fill('non-zero');
    }
    else { 
      context.closePath();
    }
    if (shouldDrawBorder) {
      if (pdfoutput===true){
        //context.fillAndStroke();
        context.stroke();
      }
      else{
        context.stroke();
        context.fill();
      }
    }
    else{
      context.fill();
    }
  }
}

/* given an arrow, draw a coloured border around it */
function drawBorder(context, arrow, colour = '#CC302E') {
  context.strokeStyle = colour;
  context.lineWidth = 2;

  context.beginPath();
  context.moveTo(arrow.coordinates[0][0], arrow.coordinates[0][1]);
  for (let j = 0; j < arrow.coordinates.length; j++) {
    context.lineTo(arrow.coordinates[j][0], arrow.coordinates[j][1]);
  }
  context.closePath();
  context.stroke();
}


function getArrowsInScope(arrows, visibleGenome, canvas, isContig=false) {
  const canvasWidth = canvas.width;
  const arrowsInScope = [];
  const middleHeight = parseInt(canvas.height / 2, 10);
  const gapToArrows = middleHeight/6;

  const maxLengthToDisplayFeatures=5000000;
  // console.log(visibleGenome[1], visibleGenome[0], visibleGenome[1]-visibleGenome[0], maxLengthToDisplayFeatures, (visibleGenome[1]-visibleGenome[0])>maxLengthToDisplayFeatures);

  if ((visibleGenome[1]-visibleGenome[0])>maxLengthToDisplayFeatures && isContig===false){
    return [];
  }

  for (let i = 0; i < arrows.length; i++) {
    if (arrows[i].featurestart > visibleGenome[1] || arrows[i].featureend < visibleGenome[0]) {
      // ignore
    } else {
      arrowsInScope.push( arrows[i] );
    }
  }
  for (let i = 0; i < arrowsInScope.length; i++) {
    arrowsInScope[i].h = (middleHeight/2) - gapToArrows;
    if (isContig===true) {
      arrowsInScope[i].h=arrowsInScope[i].h/2
    }
    arrowsInScope[i].x = (arrowsInScope[i].featurestart - visibleGenome[0]) / (visibleGenome[1] - visibleGenome[0]) * canvasWidth;
    arrowsInScope[i].w = (arrowsInScope[i].featureend - arrowsInScope[i].featurestart) / (visibleGenome[1] - visibleGenome[0]) * canvasWidth;
    // arrowsInScope[i].y  is the value of the minimum y, and .h will be added to this (.h>0)
    if (arrowsInScope[i].direction === '+') {
      arrowsInScope[i].y = middleHeight - (arrowsInScope[i].h + gapToArrows);
    } else if (arrowsInScope[i].direction === '-') {
      arrowsInScope[i].y = middleHeight + gapToArrows;
    } else {
      arrowsInScope[i].y = middleHeight - arrowsInScope[i].h / 2;
    }

    arrowsInScope[i].coordinates = [];
    arrowsInScope[i].coordinates.push([ arrowsInScope[i].x, arrowsInScope[i].y ]);
    arrowsInScope[i].coordinates.push([ arrowsInScope[i].x, arrowsInScope[i].y + arrowsInScope[i].h ]);
    arrowsInScope[i].coordinates.push([ arrowsInScope[i].x + arrowsInScope[i].w, arrowsInScope[i].y + arrowsInScope[i].h ]);
    arrowsInScope[i].coordinates.push([ arrowsInScope[i].x + arrowsInScope[i].w, arrowsInScope[i].y ]);
  }
  return arrowsInScope;
}


function drawScale(context, canvasWidth, visibleGenome, scaleYvalue, pdfoutput, numticksOpt=6) {
  // console.log(context)
  
  if (pdfoutput===true){
    context.strokeColor('black');
    //context.lineWidth(1);
  }
  else {
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.beginPath();
  }
  // draw the horisontal line
  context.moveTo(0, scaleYvalue);
  // console.log('context.lineTo('+canvasWidth+','+scaleYvalue+')')

  context.lineTo(canvasWidth, scaleYvalue);
  context.stroke();


  // draw the tick marks
  const numticks = numticksOpt;
  const tickDistancePixels = parseInt(canvasWidth / (numticks - 1), 10);
  const tickDistanceBases = parseInt((visibleGenome[1] - visibleGenome[0]) / (numticks - 1), 10);
  for (let ticknum = 0; ticknum < numticks; ticknum++) {
    const tickpos = tickDistancePixels * ticknum;
    let tickval = visibleGenome[0] + tickDistanceBases * ticknum;
    const roundto = 2;
    // measured in megabases?
    if (tickval >= 1000000) {
      tickval = tickval / 1000000;
      tickval = String(+ tickval.toFixed(roundto)) + 'Mb';
    } else if (tickval >= 1000) { // kb
      tickval = tickval / 1000;
      tickval = String(+ tickval.toFixed(2)) + 'kb';
    } else { // bp
      tickval = String(+ tickval.toFixed(2)) + 'bp';
    }
    // console.log('tick position: '+tickpos+' tick value '+tickval)
    if (pdfoutput===false){
      context.beginPath();
    }
    context.moveTo(tickpos, scaleYvalue);
    context.lineTo(tickpos, scaleYvalue + 10);
    context.stroke();
    context.save();
    if (pdfoutput===true){
      context.translate(tickpos-3, scaleYvalue + 112 );//the -3 is to try to adjust the font to the baseline. the -112 = -10 for the length of the tic, -2 for a bit of padding and -100 which allows me to set the textbox width to 100 and align to the right
      context.rotate(270, {origin: [0, 0 ]});
      context.font("Helvetica");
      context.fontSize(12);
      context.fillColor("black");
      //context.text(tickval, {align: "right"});
      context.text(tickval, 0, 0, { align: 'right', width: 100 });
    }
    else {
      context.translate(tickpos, scaleYvalue + 12 );
      context.rotate(Math.PI * 1.5);
      context.fillStyle = 'black';
      context.textBaseline = 'middle';
      context.textAlign = 'right';
      context.font = '12px Helvetica';
      context.fillText(tickval, 0, 0);
    }
    context.restore();
  }
}
