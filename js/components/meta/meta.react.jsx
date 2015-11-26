var React = require('react');
var ReactDOM = require('react-dom');
var MetadataStore = require('../../stores/MetadataStore.js');
var taxaLocations = require('../../stores/Taxa_Locations.js');
var MiscStore = require('../../stores/misc.Store.js');
var misc = require('../misc.js');

/*
The parsing of the csv file is done in the metadata store!
A click / mouseover is interpreted here as to what square (of metadata) we are in
    If there is a change in this "state" an action is triggered
    MetadataStore interprets this square and tells us what text to display :)
The Y values are from taxaLocations
They X values are calculated here
The colours are given from MetadataStore

This is currently a self contained thing, but we should really make it part of react!

*/

var MetaTextClass = React.createClass({displayName: 'displayName',
    componentDidMount: function () { // Invoked once, immediately after the initial rendering
        misc.initCanvasXY(this);
        metaInstance = new MetaText(ReactDOM.findDOMNode(this));
    },
    render: function () {
        return (
            <canvas id="metaTextCanvas" className="inContainer"></canvas>
        );
    }
});


var MetaCanvasClass = React.createClass({displayName: 'displayName',
	componentDidMount: function () { // Invoked once, immediately after the initial rendering
        misc.initCanvasXY(this);
		metaInstance = new Meta(ReactDOM.findDOMNode(this));
	},
    render: function () {
        return (
            <canvas id="metaCanvas" className="inContainer"></canvas>
        );
    }
});

function xOffsetForColumnGenerator(canvas) {
    var activeHeaders = MetadataStore.getActiveHeaders(); // eval @ funct creation
    var betweenColPadding = activeHeaders.length * 2 < canvas.width ? 1 : 0;
    var blockWidth = parseInt(canvas.width / activeHeaders.length, 10) - betweenColPadding;
    return (function (idx) {
        var xOffset = parseInt(idx * blockWidth + idx * betweenColPadding, 10);
        return ([xOffset, blockWidth]);
    });
}

function MetaText(canvas) {
    var myState  =  this;
    this.canvas  =  canvas;
    this.context =  this.canvas.getContext('2d');

    this.redraw = function () {
        var yDispPos   =  myState.canvas.height - 5;
        var headers    =  MetadataStore.getActiveHeaders();
        var xOffsetForColumn = xOffsetForColumnGenerator(myState.canvas);
        var x; // x value in pixels
        var i; // loop idx

        myState.context.clearRect(0, 0, myState.canvas.width, myState.canvas.height);

        for (i = 0; i < headers.length; i++) {
            myState.context.save();
            myState.context.fillStyle    = 'black';
            myState.context.textBaseline = 'left';
            myState.context.textAlign    = 'left';
            myState.context.font         = '12px Helvetica';
            myState.context.textBaseline = 'middle';
            x = xOffsetForColumn(i)[0] + xOffsetForColumn(i)[1] / 2;
            myState.context.translate(x, yDispPos);
            myState.context.rotate(-Math.PI / 2);
            myState.context.fillText(headers[i], 0, 0);
            myState.context.restore();
        }
    };

    // whenever the taxaLocations store changes (e.g. someones done something to the tree) we should re-draw
    taxaLocations.addChangeListener(this.redraw);

    // whenever the MetadataStore store changes we should re-draw
    MetadataStore.addChangeListener(this.redraw);

    MiscStore.addChangeListener(this.redraw);
}


function Meta(canvas) {
    var myState = this;
    var i; // idx of taxa loop
    var j; // idx of header loop
    var yValues;
    var xOffsetForColumn;
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.mouseIsOver = [undefined, undefined];
    this.blockWidth;
    window.addEventListener('resize', function () {myState.redraw();}, true);

    this.y_to_taxa = function (y) {
        // given an X position what taxa are we in? return undefined if no taxa
        var activeTaxa = taxaLocations.getActiveTaxa();
        for (i = 0; i < activeTaxa.length; i++) {
            yValues = taxaLocations.getTaxaY([activeTaxa[i]]);
            if (y >= yValues[0] && y <= yValues[1]) {
                return (activeTaxa[i]);
            }
        }
        return (undefined);
    };

    this.x_to_columnNum = function (x) {
        xOffsetForColumn = xOffsetForColumnGenerator(myState.canvas); // closure
        for (j = 0; j <  MetadataStore.getActiveHeaders().length; j++) {
            if (x >= xOffsetForColumn(j)[0] && x <= xOffsetForColumn(j)[0] + xOffsetForColumn(j)[1]) {
                return (j);
            }
        }
        return (undefined);
    };

    this.mouseMoveDetected = function (e) {
        // console.log("MOUSE DOWN")
        var mouse = myState.getMouse(e, myState.canvas);
        var newMouseOver = [myState.x_to_columnNum(mouse.x), myState.y_to_taxa(mouse.y)];
        // console.log(newMouseOver[0], newMouseOver[1])
        if (
            ( (newMouseOver[0] === undefined || newMouseOver[1] === undefined) &&
            (myState.mouseIsOver[0] === undefined || myState.mouseIsOver[1] === undefined) )
            ||
            (newMouseOver[0] === myState.mouseIsOver[0] && newMouseOver[1] === myState.mouseIsOver[1])
            ) {
            // no change
        } else {
            // console.log("CHANGE!","(x)",myState.mouseIsOver[0],"->",newMouseOver[0],"(y)",myState.mouseIsOver[1],"->",newMouseOver[1])
            myState.mouseIsOver[0] = newMouseOver[0];
            myState.mouseIsOver[1] = newMouseOver[1];
            // if (newMouseOver[0]===undefined || newMouseOver[1]===undefined) {
            //     myState.dataToDisplay = undefined
            // } else {
            //     myState.dataToDisplay =
            // }
            myState.redraw();
        }
    };

    this.redraw = function () {
        var display = false; // hack for speed increase -- is a block selected?
        var activeTaxa = taxaLocations.getActiveTaxa();
        var blockWidth;
        var blockColours; // list of blockColours for drawing blocks
        var x; // x value in pixels
        var text; // text to draw on hover
        xOffsetForColumn = xOffsetForColumnGenerator(myState.canvas); // closure
        blockWidth = xOffsetForColumn(0)[1];
        myState.context.clearRect(0, 0, myState.canvas.width, myState.canvas.height);

        if (! MetadataStore.shouldWeDisplay()) {
            return;
        }

        myState.blockWidth = myState.canvas.width / MetadataStore.getActiveHeaders().length;


        if (myState.mouseIsOver[0] !== undefined && myState.mouseIsOver[1] !== undefined) {
            display = true;
        }
        // outer loop: vertical (taxa), inner lop: horisontal (meta column)
        for (i = 0; i < activeTaxa.length; i++) {
            yValues = taxaLocations.getTaxaY([activeTaxa[i]]);
            // var xStart = 0;
            blockColours = MetadataStore.getDataForGivenTaxa(activeTaxa[i], 'colour');

            if (blockColours) { // may return null --> don't draw!

                for (j = 0; j < blockColours.length; j++) {
                    x = xOffsetForColumn(j)[0];

                    // draw the block
                    myState.context.save();
                    myState.context.fillStyle = blockColours[j];
                    myState.context.fillRect(x, yValues[0], blockWidth, yValues[1] - yValues[0]);
                    myState.context.restore();

                    if (display && j === myState.mouseIsOver[0] && activeTaxa[i] === myState.mouseIsOver[1]) {
                        myState.context.save();
                        myState.context.textAlign    =  'center';
                        myState.context.textBaseline =  'bottom';
                        myState.context.fillStyle    =  'black';
                        myState.context.font         =  '12px Helvetica';
                        text = MetadataStore.getDataForGivenTaxa(activeTaxa[i], 'value')[j];
                        // testing only -- display headers as well to check alignment
                        // text = MetadataStore.getDataForGivenTaxa(activeTaxa[i], 'value')[j] + ' ' + MetadataStore.getActiveHeaders()[j];
                        myState.context.fillText(text, xOffsetForColumn(j)[0] + xOffsetForColumn(j)[1] / 2, yValues[0]);
                        myState.context.restore();

                        // border -- used as a hack for testing really
                        myState.context.save();
                        myState.context.strokeStyle = 'black';
                        myState.context.beginPath();
                        myState.context.moveTo(x, yValues[0]); //  top left
                        myState.context.lineTo(x + blockWidth, yValues[0]); // top right
                        myState.context.lineTo(x + blockWidth, yValues[1]); // bottom right
                        myState.context.lineTo(x, yValues[1]); // bottom left
                        myState.context.lineTo(x, yValues[0]); // top left
                        myState.context.stroke();
                        myState.context.restore();
                        myState.context.restore();
                    }
                }
            }
        }
    };
    // whenever the taxaLocations store changes (e.g. someones done something to the tree) we should re-draw
    taxaLocations.addChangeListener(this.redraw);

    // whenever the MetadataStore store changes we should re-draw
    MetadataStore.addChangeListener(this.redraw);

    MiscStore.addChangeListener(this.redraw);

    this.canvas.addEventListener('mousemove', this.mouseMoveDetected, true);

    this.canvas.addEventListener('mouseout', this.mouseMoveDetected, true);
}


Meta.prototype.getMouse = function (e, canvas) {
    var element = canvas;
    var offsetX = 0;
    var offsetY = 0;
    var mx;
    var my;
    if (element.offsetParent !== undefined) {
        do {
            offsetX += element.offsetLeft;
            offsetY += element.offsetTop;
        } while ((element = element.offsetParent));
    }
    mx = e.pageX - offsetX;
    my = e.pageY - offsetY;
    // ctx = canvas.getContext('2d');
    // ctx.beginPath();
    // ctx.arc(mx, my, 5, 0, 2 * Math.PI, false);
    // ctx.fillStyle = 'red';
    // ctx.fill();
    // ctx.closePath();
    return {x: mx, y: my};
};


module.exports = {'MetaCanvasClass': MetaCanvasClass, 'MetaTextClass': MetaTextClass};

