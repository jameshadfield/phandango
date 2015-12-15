import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  layoutChange,
  turnOffCanvas,
  turnOnCanvas,
  toggleMetadataColumn,
} from '../actions/general';
import { route } from '../actions/general';
import { Switch } from '../components/switch';
import { Slider } from '../components/slider.jsx';

/*
 * Settings: Main Settings Container
 * is almose a dummy components which renders connected containers
 * @props {Function} dispatch - injected by connect
*/
export const Settings = React.createClass({
  propTypes: {
    dispatch: PropTypes.func.isRequired,
  },
  componentDidMount: function () {
    // modal-like "click to close"
    this.node.addEventListener('click', (e) => {
      // react id of div: this.node._reactInternalComponent._rootNodeID
      // react id of where click was fired: e.target.attributes[1].nodeValue
      if (e.target.attributes[1].nodeValue === this.node._reactInternalComponent._rootNodeID) {
        this.props.dispatch(route('canvases'));
      }
    }, false);
  },

  render: function () {
    const panelClassName = 'settings-col';
    return (
      <div className="fullpage bgwhite-alpha" ref={(c) => this.node = c} key="myKey">
        <ConnectedLayout className={panelClassName} />
        <ConnectedMetadata className={panelClassName} />
      </div>
    );
  },
});


/*
 * Layout container:
 * a connected component
 * sets up the sliders controlling column and row percentages
 * uses the (dumb) component 'slider.jsx' to display the actual slider
*/

const Layout = React.createClass({
  propTypes: {
    colPercs: PropTypes.arrayOf(PropTypes.number).isRequired,
    rowPercs: PropTypes.arrayOf(PropTypes.number).isRequired,
    onSliderChange: PropTypes.func.isRequired,
    className: PropTypes.string,
  },

  componentWillReceiveProps(newProps) {
    console.log('Layout received new props:', newProps);
  },


  render: function () {
    console.log('render called. row percs are: ', this.props.rowPercs);
    const colNames = [ 'Left', 'Middle', 'Right' ];
    const Columns = this.props.colPercs.map((cv, idx) =>
      <Slider
        key={'C' + idx}
        name={colNames[idx] + ' Column.'}
        currentValue={cv}
        newValue={this.props.onSliderChange.bind(this, true, idx)}
      />
    );
    const rowNames = [ 'Top', 'Middle', 'Bottom' ];
    const Rows = this.props.rowPercs.map((cv, idx) =>
      <Slider
        key={'R' + idx}
        name={rowNames[idx] + ' Row.'}
        currentValue={cv}
        newValue={this.props.onSliderChange.bind(this, false, idx)}
      />
    );
    return (
      <div className={this.props.className}>
        {Columns}
        {Rows}
      </div>
    );
  },

});

const ConnectedLayout = connect(
  (state)=>({
    colPercs: state.layout.colPercs,
    rowPercs: state.layout.rowPercs,
  }),
  (dispatch)=>({
    onSliderChange: (col, idx, e) =>
      dispatch(layoutChange(col, idx, parseInt(e.target.value, 10))),
  })
)(Layout);


/*
 * Metadata container:
 * sets up the sliders controlling column and row percentages
 * uses the component 'switch.jsx' to display the toggles
 * controlls the callbacks from the switches
*/

const Metadata = React.createClass({
  propTypes: {
    headerNames: PropTypes.arrayOf(PropTypes.string).isRequired,
    toggles: PropTypes.arrayOf(PropTypes.bool).isRequired,
    fileName: PropTypes.string,
    active: PropTypes.bool,
    className: PropTypes.string,
    toggleMeta: PropTypes.func.isRequired,
    toggleMetaHeader: PropTypes.func.isRequired,
  },

  componentWillReceiveProps(newProps) {
    console.log('Metadata received new props:', newProps);
  },

  render() {
    if (!this.props.fileName) { return false; }
    console.log('render called. toggles are: ', this.props.toggles);
    const Toggles = this.props.toggles.map((cv, idx) =>
      <li key={idx}>idx {idx}: {cv.toString()}</li>
    );
    return (
      <div className={this.props.className}>
        <ul>{Toggles}</ul>
        <h4>Metadata</h4>
        <hr/>
        {/* main on-off switch */}
        <Switch
          id="master"
          header="Master switch"
          handleChange={this.props.toggleMeta.bind(this, this.props.active)}
          isChecked={this.props.active}
          disabled={false}/>
        <hr/>
        <div className = {this.props.active ? '' : 'hidden'}>
          {this.props.headerNames.map((name, idx) =>
            <Switch
              id={idx + ''}
              key={idx}
              header={name}
              handleChange={this.props.toggleMetaHeader.bind(this, this.props.toggles[idx], idx)}
              isChecked={this.props.toggles[idx]}
              disabled={false}
            />
          )}
        </div>
      </div>
    );
  },

});

const ConnectedMetadata = connect(
  (state)=>({
    headerNames: state.metadata.headerNames,
    toggles: state.metadata.toggles,
    fileName: state.metadata.fileName,
    active: state.layout.active.meta,
  }),
  (dispatch)=>({
    toggleMeta: (currentValue) => {
      currentValue ? dispatch(turnOffCanvas('meta')) : dispatch(turnOnCanvas('meta'));
    },
    toggleMetaHeader: (currentValue, headerIdx) => {
      dispatch(toggleMetadataColumn(headerIdx, !currentValue));
    },
  })
)(Metadata);
