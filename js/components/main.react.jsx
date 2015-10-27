// canvas stuff here: http://jsfiddle.net/JMZc5/1/

var React = require('react');
var ReactDOM = require('react-dom');
var Landing = require('./landing.react.jsx');
var CanvasDivs = require('./canvases.react.jsx');
var Settings = require('./settings.react.jsx');
var Actions = require('../actions/actions.js');
var RawDataStore = require('../stores/RawDataStore.js');


function add(a, b) {return a+b}; // http://stackoverflow.com/questions/1230233/how-to-find-the-sum-of-an-array-of-numbers


// this is an extremely stateful component
// it is the main class called by app.js
// it includes a router e.t.c
var Main_React_Element = React.createClass({displayName: "Main_React_Element",
	getInitialState: function() {
		// initial values
		var divPerc = {col:[20,11,69],row:[15,70,15]};
		var router = 'landing'; // what page do we start with?
		// console.log("ROUTER:",router)
		var elementsOn = {col:[true,true,true],row:[true,true,true]}
		var componentsLoaded = RawDataStore.getLoadedStatus();
		return({divPerc: divPerc, router:router,elementsOn:elementsOn,componentsLoaded:componentsLoaded});
	},
	keyIncoming: function(key){
		// http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
		// console.log("incoming key stroke",event.keyCode)
		if (event.keyCode === 83 || event.charCode === 83){ // 's'
			this.setState({router: this.state.router=="settings" ? 'main' : 'settings'});
		}
		else if (event.keyCode === 68 || event.charCode === 68){ // 'd'
			this.setState({router: 'main'});
			Actions.loadDefaultData();
		}
		else if (event.keyCode === 76 || event.charCode === 76){ // 'l'
			this.setState({router: this.state.router=="landing" ? 'main' : 'landing'});
		}
	},
	toggleColRow: function(colRow,num){
		// console.log("params:",colRow,num)
		// this is a callback from settings
		var elementsOn = {col:this.state.elementsOn.col.slice(),row:this.state.elementsOn.row.slice()};
		elementsOn[colRow][num-1] = !this.state.elementsOn[colRow][num-1];
		// console.log("elementsOn (columns) were:",this.state.elementsOn.col,"are now",elementsOn.col)
		this.setState({elementsOn:elementsOn});
		elementsOn[colRow][num-1] ? this.newDivPerc(colRow,num,11) : this.newDivPerc(colRow,num,0);
	},
	newDivPerc: function(colRow,num,event){
		// this is a callback for a user change to a slider
		num-=1;
		var divPerc = {col:this.state.divPerc.col.slice(),row:this.state.divPerc.row.slice()};
		// event could be the new value (not an actual event!)
		divPerc[colRow][num] = isFinite(event) ? event : parseInt(event.target.value);
		// divPerc[colRow][num]=parseInt(event.target.value);
		var newSpaceToFill = this.state.divPerc[colRow][num] - divPerc[colRow][num] // could be -ve
		// console.log("new space to fill:",newSpaceToFill)
		for (var i=0; i<divPerc[colRow].length; i++) {
			if(i===num) {continue}
			divPerc[colRow][i] = parseInt(this.state.divPerc[colRow][i] + newSpaceToFill*(this.state.divPerc[colRow][i] / 100))
		}
		// randomly asign an index the extra amount!  http://stackoverflow.com/questions/4959975/generate-random-value-between-two-numbers-in-javascript
		// ensure that if an element is "off" it is always 0
		// i.e. what are all the indexes that can receive the overflow?
		// this is fivPerc[colRow]
		// var possible_idx_values_to_get_overflow = divPerc[colRow].slice();
		// possible_idx_values_to_get_overflow.splice(num,1); // splice out the changed idx
		// for (var i=0; i<this.state.elementsOn.length; i++) {
		// 	if (!this.state.elementsOn[i]) { // i.e. turned off
		// 	}
		// }
		// myArray[Math.floor(Math.random() * myArray.length)]
		// divPerc[colRow][Math.floor(Math.random()*(3))] -= divPerc[colRow].reduce(add,0) - 100;
		divPerc[colRow][0] -= divPerc[colRow].reduce(add,0) - 100;
		if (divPerc[colRow].reduce(add,0) !== 100) {
			console.log("percentages don't add to 100%",colRow,"=",divPerc[colRow])
		}
		this.setState({divPerc:divPerc});

		// console.log("phylocanvas div is w:",parseInt(divPerc.col[0]/100*document.documentElement.clientWidth),"px & h:",parseInt(divPerc.row[1]/100*document.documentElement.clientHeight),"px")
		// console.log("gubbins div is w:",parseInt(divPerc.col[2]/100*document.documentElement.clientWidth),"px & h:",parseInt(divPerc.row[1]/100*document.documentElement.clientHeight),"px")

		this.recomputeAndDrawCanvases();

	},

	recomputeAndDrawCanvases: function(){
		// console.log("recomputing canvases");
		var canvases = document.getElementsByTagName("canvas");
		for (var i = canvases.length - 1; i >= 0; i--) {
			var width = canvases[i].clientWidth;
			var height = canvases[i].clientHeight;
			if (canvases[i].width != width || canvases[i].height != height) {
			 	// Change the size of the canvas to match the size it's being displayed
			 	canvases[i].width = width;
			 	canvases[i].height = height;
			 	// console.log("\t", canvases[i].id, ' resized to w:',width,'h',height);
			 	// now we need to redraw the canvas
			}
		};

		// phylocanvas is a black box
		phylocanvas.resizeToContainer();
		phylocanvas.draw(true); // forces phylocanvas.fitInPanel()

		Actions.phylocanvas_changed()
		Actions.redrawAll();
	},
	componentDidMount: function() {
		var myState = this;
		document.addEventListener('keyup', this.keyIncoming);
		window.onresize = this.recomputeAndDrawCanvases;
		ReactDOM.findDOMNode(this).addEventListener("dragover", function(event) {
		    event.preventDefault();
		}, false);
		ReactDOM.findDOMNode(this).addEventListener("drop", function(event) {
		    event.preventDefault();
			var files = event.dataTransfer.files;
			// if files.length>1 then do some carny apply trick to call multiple actions
			Actions.files_dropped(files)
			myState.setState({router:'main'});
		}, false);
		RawDataStore.addChangeListener(function() {
			myState.setState({'componentsLoaded' : RawDataStore.getLoadedStatus()});
		})
	},
	render: function() {
		return(
			<div id="mainDiv">
				<Landing on={this.state.router=='landing' ? true : false}/>

				<Settings on={this.state.router=='settings' ? true : false} divPerc={this.state.divPerc} newDivPerc={this.newDivPerc} topState={this} toggleColRow={this.toggleColRow} elementsOn={this.state.elementsOn} componentsLoaded={this.state.componentsLoaded}/>
				<CanvasDivs divPerc={this.state.divPerc} on={true} elementsOn={this.state.elementsOn} componentsLoaded={this.state.componentsLoaded}/> {/* always on to keep components alive */}
			</div>
		)
	},
});



module.exports = Main_React_Element;
