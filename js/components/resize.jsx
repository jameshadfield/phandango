import React from 'react';
import { Mouse } from '../misc/mouse';
import { layoutPercentChange } from '../actions/general';

export const Drag = React.createClass({
  propTypes: {
    rowPercs: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
    colPercs: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
    dispatch: React.PropTypes.func.isRequired,
    style: React.PropTypes.object.isRequired,
  },

  getDefaultProps: function () {
    return {
      rowPercs: [ 15, 70, 15 ],
    };
  },

  // set up some initial states, although these shouldn't be used
  getInitialState: function () {
    return {
      index: this.props.index,
      isCol: this.props.isCol,
      rowPos: this.props.rowPercs[this.props.style.index],
      dragging: false,
    };
  },

  componentDidMount: function () {
    this.mouse = new Mouse(this.canvas, this.props.dispatch, function () { }); // set up listener for mousedown on the div
    this.canvas.addEventListener('mousedown', this.onMouseDown, true);
    this.forceUpdate();
  },

  // set up some document event listeners when dragging to catch the mouse move and mouse up
  componentDidUpdate: function (props, state) {
    if (this.state.dragging && !state.dragging) {
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    } else if (!this.state.dragging && state.dragging) {
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    }
  },

  // calculate relative position to the mouse and set dragging=true
  onMouseDown: function (e) {
    // only left mouse button
    if (e.button !== 0) {
      return;
    }
    // const canvasPos = this.canvas.getBoundingClientRect();
    // var pos = 100 * (canvasPos.top / window.innerHeight);
    this.setState({
      dragging: true,
    });
    e.stopPropagation();
    e.preventDefault();
  },

  onMouseUp: function (e) {
    this.setState({ dragging: false });
    e.stopPropagation();
    e.preventDefault();
    // on mouse up we want to dispatch changes to the layout (either rowPercs or colPercs)
    this.props.dispatch(layoutPercentChange(this.state.isCol, this.state.index, this.state.pos));
  },

  onMouseMove: function (e) {
    if (!this.state.dragging) {
      return;
    }
    /* calculate the appropriate div and mouse positions in % */
    const myPercs = this.state.isCol ? this.props.colPercs.slice(0) : this.props.rowPercs.slice(0);
    const myPos = this.state.isCol ? 100 * (e.pageX / window.innerWidth) : 100 * (e.pageY / window.innerHeight);

    /* Calculate the new position from the mouse position
     * handle edge cases where you drag a panel to zero size.
     * Need to work out how to handle this when the dragging divs are on top of each other
     */

    if ((this.state.index < myPercs.length - 1) && (myPos > this.cumulativePosition(this.state.index + 1, myPercs))) {
      /* handle the case where you drag to or past the next div - i.e. the next div becomes zero size */
      this.setState({
        pos: this.cumulativePosition(this.state.index + 1, myPercs),
      });
    } else if ((this.state.index > 0) && (myPos < this.cumulativePosition(this.state.index - 1, myPercs))) {
      /* handle the case where you drag to or past the previous div -i.e. to zero size */
      this.setState({
        pos: 0,
      });
    } else {
      this.setState({
        pos: myPos - this.cumulativePosition(this.state.index - 1, myPercs),
      });
    }

    /* dispatch the changes to the layout (either rowPercs or colPercs) */
    this.props.dispatch(layoutPercentChange(this.state.isCol, this.state.index, this.state.pos));
    e.stopPropagation();
    e.preventDefault();
  },

  render: function () {
    return (
      <div>
        <canvas
          id="Drag"
          ref={(c) => this.canvas = c}
          style={this.props.style}
        />
      </div>
    );
  },

  /* Function to calculate cumulative position of each div from the sizes of those preceeding them */
  cumulativePosition: function (index, percs) {
    let cumPos = 0;
    for (let i = 0; i < index + 1; i++) {
      cumPos += percs[i];
    }
    // console.log("cumPos", index, percs, cumPos)
    return cumPos;
  },
});
