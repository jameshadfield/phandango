
var React = require('react');
var RawDataStore = require('../stores/RawDataStore.js');
var Actions = require('../actions/actions.js');
var MetadataStore = require('../stores/MetadataStore.js');
var Taxa_Locations = require('../stores/Taxa_Locations.js')


/*
The parsing of the csv file is done in the metadata store!
A click / mouseover is interpreted here as to what square (of metadata) we are in
    If there is a change in this "state" an action is triggered
    MetadataStore interprets this square and tells us what text to display :)
The Y values are from Taxa_Locations
They X values are calculated here
The colours are given from MetadataStore

This is currently a self contained thing, but we should really make it part of react!

*/


var MetaCanvasClass = React.createClass({displayName: "displayName",

	componentDidMount: function() { // Invoked once, immediately after the initial rendering
		// Canvas grid is set here, and we want this to be the same as the CSS...
		// the CSS scales the canvas, but we have to set the correct width and height here as well
		// see
		this.getDOMNode().setAttribute('width', window.getComputedStyle(this.getDOMNode()).width)
		this.getDOMNode().setAttribute('height', window.getComputedStyle(this.getDOMNode()).height)
		metaInstance = new meta(this.getDOMNode());

        RawDataStore.addChangeListener(function() {
            var incomingData = RawDataStore.getData() // reference
            if ("csv" in incomingData) {
                setTimeout(function() {
                    // console.log(incomingData["gff"][j].substring(0,100))
                    // trigger an action here which is taken by the MetadataStore :)
                    Actions.csvStringReceived(incomingData["csv"][0])
                    // metaInstance.load(incomingData["csv"][0])
                }
            )};

        });

	},
    render: function() {
        return(
            <canvas id="metaCanvas" className="inContainer"></canvas>
        );
    }
});



function meta(canvas) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.mouseIsOver = [undefined,undefined]
    this.blockWidth
    var myState = this;

    this.mouse_moves = new mouse_moves(this.canvas);
    window.addEventListener('resize', function(){myState.redraw()}, true);

    this.y_to_taxa = function(y) {
        // given an X position what taxa are we in? return undefined if no taxa
        var activeTaxa = Taxa_Locations.getActiveTaxa();
        for (var i=0; i<activeTaxa.length; i++) {
            var yValues = Taxa_Locations.getTaxaY([activeTaxa[i]])
            if (y>=yValues[0] && y<=yValues[1]) {
                return (activeTaxa[i])
            }
        }
        return (undefined);
    }

    this.x_to_columnNum = function(x) {
        var xStart = 0;
        for (var j=0; j< MetadataStore.getActiveHeaders().length; j++) {
            if (x>=xStart && x<=xStart+myState.blockWidth) {
                return (j);
            }
            xStart += myState.blockWidth;
        }
        return (undefined);
    }

    this.canvas.addEventListener('mousemove', function(e) {
        // console.log("MOUSE DOWN")
        var mouse = myState.getMouse(e, myState.canvas);
        var newMouseOver = [myState.x_to_columnNum(mouse['x']), myState.y_to_taxa(mouse['y'])]
        // console.log(newMouseOver[0], newMouseOver[1])
        if ( ( (newMouseOver[0]===undefined || newMouseOver[1]===undefined) && (myState.mouseIsOver[0]===undefined || myState.mouseIsOver[1]===undefined) ) || (newMouseOver[0]===myState.mouseIsOver[0] && newMouseOver[1]===myState.mouseIsOver[1]) ) {
            // no change
        } else {
            // console.log("CHANGE!","(x)",myState.mouseIsOver[0],"->",newMouseOver[0],"(y)",myState.mouseIsOver[1],"->",newMouseOver[1])
            myState.mouseIsOver[0] = newMouseOver[0]
            myState.mouseIsOver[1] = newMouseOver[1]
            // if (newMouseOver[0]===undefined || newMouseOver[1]===undefined) {
            //     myState.dataToDisplay = undefined
            // } else {
            //     myState.dataToDisplay =
            // }
            myState.redraw()
        }
    }, true);

    this.redraw = function() {
        if (! MetadataStore.shouldWeDisplay()) {
            return
        }
        myState.context.clearRect(0, 0, myState.canvas.width, myState.canvas.height);
        /* redraws are expensive. We need to work out if we redraw.
        we only redraw if   * Taxa_Locations have changed (i.e. y values are different) <-- this is taken care of in the store
                            * Click in this region
                            * CSV file parsed (MetadataStore emission)
        */
        // console.log("active headers are: ",MetadataStore.getActiveHeaders())
        // console.log("active taxa are: ",Taxa_Locations.getActiveTaxa())

        // we start by using the whole X width available
        myState.blockWidth = myState.canvas.width / MetadataStore.getActiveHeaders().length;

        var display=false
        if (myState.mouseIsOver[0]!==undefined && myState.mouseIsOver[1]!==undefined) {
            var display=true
        }

        // draw each (active) taxa
        var activeTaxa = Taxa_Locations.getActiveTaxa();
        for (var i=0; i<activeTaxa.length; i++) {
            var yValues = Taxa_Locations.getTaxaY([activeTaxa[i]])
            var xStart = 0;
            var blockColours = MetadataStore.getDataForGivenTaxa(activeTaxa[i],'colour')
            if (blockColours) { // may return null --> don't draw!
                for (var j=0; j<blockColours.length; j++) {
                    myState.context.save();
                    myState.context.fillStyle = blockColours[j]
                    // myState.context.globalAlpha=
                    myState.context.fillRect(xStart, yValues[0], myState.blockWidth, yValues[1]-yValues[0]);
                    myState.context.restore();

                    if (display && j===myState.mouseIsOver[0] && activeTaxa[i]===myState.mouseIsOver[1]) {
                        myState.context.save();
                        myState.context.textAlign = "centre";
                        myState.context.textBaseline="bottom";
                        myState.context.fillStyle = "black";
                        myState.context.font="12px Helvetica";
                        myState.context.fillText(MetadataStore.getDataForGivenTaxa(activeTaxa[i],'value')[j], parseInt(xStart+(myState.blockWidth/2)), yValues[0]);
                        myState.context.restore();
                    }
                    xStart += myState.blockWidth;
                }
            }
        }

        // draw the labels
        if (Taxa_Locations.getTaxaY([activeTaxa[0]])[0] > 20) {
            var yDispPos = parseInt(Taxa_Locations.getTaxaY([activeTaxa[0]])[0])-5;
            var headers = MetadataStore.getActiveHeaders();
            var xDispPos            = parseInt(myState.blockWidth / 2);
            for (var i=0; i<headers.length; i++) {
                myState.context.save();
                myState.context.fillStyle = "black";
                myState.context.textBaseline="left";
                myState.context.textAlign = "left";
                myState.context.font="12px Helvetica";
                var X=xDispPos
                var Y=yDispPos
                myState.context.translate(X,Y);
                myState.context.rotate(-Math.PI/2);
                // console.log("printing header ",headers[i],"at X: ",X," Y: ",Y)
                myState.context.fillText(headers[i], 0, 0);
                myState.context.restore();
                xDispPos += parseInt(myState.blockWidth)
            }

        }


    }

    // whenever the Taxa_Locations store changes (e.g. someones done something to the tree) we should re-draw
    Taxa_Locations.addChangeListener(this.redraw);

    // whenever the MetadataStore store changes we should re-draw
    MetadataStore.addChangeListener(this.redraw);
}


meta.prototype.getMouse = function(e, canvas) {
    var element = canvas, offsetX = 0, offsetY = 0, mx, my;
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
    // ctx.fillStyle = 'green';
    // ctx.fill();
    // ctx.closePath();
    return {x: mx, y: my};
}





module.exports = {'MetaCanvasClass': MetaCanvasClass};

