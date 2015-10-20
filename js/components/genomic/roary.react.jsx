componentWillReceiveProps


var React = require('react');
var gubbins = require('./genomic.canvas.js');
var graph = require('../../canvas/plots/main.plot.js');
var RawDataStore = require('../../stores/RawDataStore.js');

var scale_canvas = function(myState) {
    myState.getDOMNode().setAttribute('width', window.getComputedStyle(myState.getDOMNode()).width)
    myState.getDOMNode().setAttribute('height', window.getComputedStyle(myState.getDOMNode()).height)
}


var GenomicCanvasClass = React.createClass({displayName: "displayName",

	componentDidMount: function() { // Invoked once, immediately after the initial rendering
        var myState = this;
        // console.log("genomic component has mounted")
		// Canvas grid is set here, and we want this to be the same as the CSS...
		// the CSS scales the canvas, but we have to set the correct width and height here as well
		// see
		this.getDOMNode().setAttribute('width', window.getComputedStyle(this.getDOMNode()).width)
		this.getDOMNode().setAttribute('height', window.getComputedStyle(this.getDOMNode()).height)

        // console.log("gubbins node set to w: ",window.getComputedStyle(this.getDOMNode()).width,"h:",window.getComputedStyle(this.getDOMNode()).height)

		gubbinsInstance = new gubbins(this.getDOMNode());
        gubbinsInstance.redraw();

        // RawDataStore.addChangeListener(function() {
        //     var incomingData = RawDataStore.getData() // reference
        //     if ("gff" in incomingData) {
        //         // the following is added to the event loop else we get Dispatch errors
        //         // we need the nested functions as javascript doesn't have block scope
        //         // it only has function scope
        //         for (var i=0; i<incomingData["gff"].length; i++) {
        //             // console.log('gubbins.react respose -> event loop')
        //             setTimeout(function(j) {
        //                 return function() {
        //                     // console.log(incomingData["gff"][j].substring(0,100))
        //                     gubbinsInstance.load(incomingData["gff"][j])
        //                 }
        //             }(i), 0);
        //         }
        //     }
        // });


	},

	render: function() {
        return(
            <canvas id="gubbinsCanvas" className="inContainer"/>
        );
	}
});

var RecombGraphClass = React.createClass({displayName: "displayName",

    componentDidMount: function() { // Invoked once, immediately after the initial rendering
        // Canvas grid is set here, and we want this to be the same as the CSS...
        // the CSS scales the canvas, but we have to set the correct width and height here as well
        // see
        this.getDOMNode().setAttribute('width', window.getComputedStyle(this.getDOMNode()).width)
        this.getDOMNode().setAttribute('height', window.getComputedStyle(this.getDOMNode()).height)
        // console.log("graph DOM node:",this.getDOMNode())
        var recombGraph = new graph(this.getDOMNode(), "recombGraph");

    },

    render: function() {
        return (
            <canvas id="recombGraphDiv" className="inContainer"></canvas>
        );
    }
});

// this was the prev graph JSX
// <canvas id="recombGraphDiv"  className="col-3 row-3 blue"></canvas>
//             <div id="insideGraph" className="inside red">ASBXKJSAB</div>

module.exports = {'RecombGraphClass': RecombGraphClass, 'GenomicCanvasClass': GenomicCanvasClass};


