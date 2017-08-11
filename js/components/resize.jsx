import React from 'react';
import PropTypes from 'prop-types';
import { layoutPercentChange } from '../actions/general';
import { changePercs } from '../reducers/layout';

/* an explanation of state vs props for this component
 *
 * props relate to the actual div percentages
 * state is used when we are dragging the handles
 * and represents the future div percentages
 * when handles are released, this.state.dragging -> false
 * and an action propogates which ends up changing the props
 */
export class Drag extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = { dragging: false };

    // calculate relative position to the mouse and set dragging=true
    this.onMouseDown = (e) => {
      // only left mouse button
      if (e.button !== 0) {
        return;
      }
      this.setState({
        dragging: true,
        pos: undefined,
        percs: this.props.isCol ? this.props.colPercs : this.props.rowPercs,
      });
      e.stopPropagation();
      e.preventDefault();
    };

    this.onMouseUp = (e) => {
      this.setState({ dragging: false });
      e.stopPropagation();
      e.preventDefault();
      if (this.state.pos) {
        this.props.dispatch(layoutPercentChange(this.props.isCol, this.props.index, this.state.pos));
      }
    };

    this.onMouseMove = (e) => {
      if (!this.state.dragging) {
        return;
      }
      let pos; /* measured in percentages */
      // this.state.percs has been set now!
      pos = this.props.isCol ? 100 * (e.pageX / window.innerWidth) : 100 * (e.pageY / window.innerHeight);
      for (let i = 0; i < this.props.index; i++) {
        pos -= this.state.percs[i];
      }
      this.setState({
        percs: changePercs(this.state.percs, pos, this.props.index),
        pos,
      });
      e.stopPropagation();
      e.preventDefault();
    };

    /* Function to calculate cumulative position of each div from the sizes of those preceeding them */
    this.cumulativePosition = (index, percs) => {
      let cumPos = 0;
      for (let i = 0; i < index + 1; i++) {
        cumPos += percs[i];
      }
      // console.log("cumPos", index, percs, cumPos)
      return cumPos;
    };

    this.makeVh = (n) => {
      return (n.toString() + 'vh');
    };

    this.resizeFn = () => {
      this.forceUpdate();
    };
  }

  componentDidMount() {
    this.div.addEventListener('mousedown', this.onMouseDown, true);
    window.addEventListener('resize', this.resizeFn, false);
    this.resizeFn();
  }

  // set up some document event listeners when dragging to catch the mouse move and mouse up
  componentDidUpdate(props, state) {
    if (this.state.dragging && !state.dragging) {
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    } else if (!this.state.dragging && state.dragging) {
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFn, false);
  }

  render() {
    const leftMargin = parseInt(getComputedStyle(document.body, null).getPropertyValue('margin-left'), 10);
    const topMargin = parseInt(getComputedStyle(document.body, null).getPropertyValue('margin-top'), 10);
    const z = 90;
    const halfIcon = 7.5;
    let leftPos;
    let topPos;
    let percAbove = 0;
    /* calculate the topPos and leftPos of this div */
    if (this.props.isCol) {
      const percs = this.state.dragging ? this.state.percs : this.props.colPercs;
      let percLeft = 0;
      for (let i = 0; i <= this.props.index; i++) {
        percLeft += percs[i];
      }
      leftPos = (window.innerWidth * (percLeft / 100)) - halfIcon + leftMargin;
      topPos = (window.innerHeight / 2); // + (this.props.index * 15);
    } else {
      const percs = this.state.dragging ? this.state.percs : this.props.rowPercs;
      // const toremove = ((this.props.index + 1) * 7) - 4; // WTF
      leftPos = (window.innerWidth / 2); // + (this.props.index * 50);
      for (let i = 0; i <= this.props.index; i++) {
        percAbove += percs[i];
      }
      topPos = 'calc(' + this.makeVh(percAbove) + ' - ' + halfIcon.toString() + 'px + ' + topMargin.toString() + 'px - ' + ((percAbove / 100) * 3).toString() + 'px)';
    }
    let line = null;

    if (this.state.dragging) {
      if (this.props.isCol) {
        line = (
          <div
            style = {{
              height: '100%',
              width: '2px', /* Line width */
              backgroundColor: 'black',
              left: leftPos + halfIcon - 1,
              zIndex: z,
              position: 'absolute',
              top: 0,
              // left: leftPos,
            }}
          />
        );
      } else {
        line = (
          <div
            style = {{
              width: '100%',
              height: '2px', /* Line width */
              backgroundColor: 'black',
              left: 0,
              zIndex: z,
              position: 'absolute',
              top: 'calc(' + this.makeVh(percAbove) + ' + ' + topMargin.toString() + 'px - ' + ((percAbove / 100) * 3).toString() + 'px - 2px)',
            }}
          />
        );
      }
    }
    return (
      <div>
        <div
          className = "dragHandle"
          ref={(c) => this.div = c}
          style = {{
            position: 'absolute',
            width: '15px',
            height: '15px',
            cursor: this.props.isCol ? 'col-resize' : 'row-resize',
            // background: background,
            left: leftPos,
            top: topPos,
            zIndex: z,
          }}
        />
        {line}
      </div>
    );
  }
}

Drag.propTypes = {
  rowPercs: PropTypes.arrayOf(PropTypes.number).isRequired,
  colPercs: PropTypes.arrayOf(PropTypes.number).isRequired,
  dispatch: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  isCol: PropTypes.bool.isRequired,
};
