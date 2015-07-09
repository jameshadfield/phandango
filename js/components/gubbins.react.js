


var GubbinsCanvas = React.createClass({displayName: "displayName",

  getInitialState: function() {
 	return {on: CanvasOracle.getAll()['gubbins']};
  },

  componentDidMount: function() { // Invoked once, immediately after the initial rendering
  	CanvasOracle.addChangeListener(this._onChange_react);
    if (this.state.on) {
    	var context = this.getDOMNode().getContext('2d');
    	this.paint(context);
	}
  },

  //Invoked immediately after the component's updates are flushed to the DOM. This method is not called for the initial render.
  componentDidUpdate: function() {
  	if (this.state.on) {
	    var context = this.getDOMNode().getContext('2d');
	    this.paint(context);
	}
  },

  _onChange_react: function() {
	this.setState({on: CanvasOracle.getAll()['gubbins']});
  },

  paint: function(context) {
  	context.save();
  	context.fillStyle = '#F00';
  	context.fillRect(50, 50, 100, 100);
  	context.restore();
  },

  render: function() {
  	// console.log("Rendering GubbinsCanvas. ON??? "+this.state.on)
  	if (this.state.on) {
  		return React.createElement("canvas", {width: 400, height: 800, id:"gubbinsCanvas"});
  	}
  	else {
  		return null
  	}
  }
});


