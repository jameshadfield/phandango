import React from 'react';
import ReactDOM from 'react-dom';
import { Mouse, getMouse } from '../misc/mouse';


export const Row1Drag = React.createClass({
  propTypes: {
    rowPercs: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
    onYChange: React.PropTypes.func.isRequired,
    // dispatch: React.PropTypes.func.isRequired,
    style: React.PropTypes.object.isRequired,
  },

getDefaultProps: function () {
    return {
      // allow the initial position to be passed in as a prop
      rowPercs: [15,75,15],
    }
  },

getInitialState: function () {
    return {
      pos: this.props.rowPercs[0],
      dragging: false,
      rel: null // position relative to the cursor
    }
  },

   componentDidMount: function () {
    this.mouse = new Mouse(this.canvas, this.props.dispatch, this.onClickCallback); // set up listeners
    // this.canvas.addEventListener('mousemove', this.onMouseMove, true);
    this.canvas.addEventListener('mousedown', this.onMouseDown, true);
    // this.canvas.addEventListener('mouseup', this.onMouseUp, true);
    this.forceUpdate();
  },

	
	onClickCallback(mx, my) {
    console.log(mx, my);
  },
  // we could get away with not having this (and just having the listeners on
  // our div), but then the experience would be possibly be janky. If there's
  // anything w/ a higher z-index that gets in the way, then you're toast,
  // etc.
  componentDidUpdate: function (props, state) {
    if (this.state.dragging && !state.dragging) {
      document.addEventListener('mousemove', this.onMouseMove)
      document.addEventListener('mouseup', this.onMouseUp)
    } else if (!this.state.dragging && state.dragging) {
      document.removeEventListener('mousemove', this.onMouseMove)
      document.removeEventListener('mouseup', this.onMouseUp)
    }
  },

  // calculate relative position to the mouse and set dragging=true
  onMouseDown: function (e) {
    // only left mouse button
    if (e.button !== 0) return
	var canvasPos = this.canvas.getBoundingClientRect();
	var pos = 100*(canvasPos.top/window.innerHeight);
	console.log(canvasPos.top, window.innerHeight, pos)
    this.setState({
      dragging: true,
    })
    e.stopPropagation()
    e.preventDefault()
  },
  onMouseUp: function (e) {
    this.setState({dragging: false})
    e.stopPropagation()
    e.preventDefault()
    console.log("up", this.state.pos)
  },
  onMouseMove: function (e) {
    if (!this.state.dragging) return
	if (100*(e.pageY/window.innerHeight)>this.props.rowPercs[1]){
		this.setState({
      		pos: this.props.rowPercs[1]
    	})
	}
	else
    	{this.setState({
          pos: 100*(e.pageY/window.innerHeight)
        })}
    e.stopPropagation()
    e.preventDefault()
  },
  render: function () {
    var myStyle = Object.assign({}, this.props.style);
    myStyle["top"]="calc("+this.state.pos+"vh - 3px)"
    // this.props.initialPosPerc="calc("+this.state.pos+"vh - 3px)";
    console.log(this.props.style, myStyle)
    return (
      <div>
        <canvas
          id="Row1Drag"
          ref={(c) => this.canvas = c}
          style={myStyle}
          // onChange={this.props.onYChange.bind(this, false, 0)}
        />
      </div>
    );
  }
})


  // getInitialState: function () {
  //   return ({ geneSelected: undefined, geneHovered: undefined , contigSelected: undefined, contigHovered: undefined });
  // },

//   componentDidMount: function () {
//     this.mouse = new Mouse(this.canvas, this.props.dispatch, this.onClickCallback); // set up listeners
//     this.canvas.addEventListener('mousemove', this.onMouseMove, true);
//   },

//   shouldComponentUpdate() {
//     return true;
//   },

//   onClickCallback(mx, my) {
//     console.log(mx, my);
//   },

//   onMouseMove(e) {
//     const mouse = getMouse(e, this.canvas);
//     if (mouse.dragging)
//     {console.log(mouse.x, mouse.y);}
//   },

//   render() {
    
//     //if (contigs[0]) {console.log(contigs[0].disp)} else {console.log(contigs)}
//     return (
//       <div>
//         <canvas
//           id="Row1Drag"
//           ref={(c) => this.canvas = c}
//           style={this.props.style}
//         />
//       </div>
//     );
//   },
// });