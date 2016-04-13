import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  layoutChange,
  turnOffCanvas,
  turnOnCanvas,
  toggleMetadataColumn,
  toggleOffAllMetaHeaders,
  showBlocks,
  toggleLogo,
} from '../actions/general';
import { route } from '../actions/general';
import Slider from 'material-ui/lib/slider';
import Toggle from 'material-ui/lib/toggle';

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
    // const panelClassName = 'settings-col';
    const panelClassName = 'col-xs-3 bgwhite border noOverflow';
    // <ConnectedLoadedComponents className={panelClassName} />
    return (
      <div className="fullpage padding10 content" style={{ zIndex: 100 }} ref={(c) => this.node = c} key="myKey">
        <div className="row" >
          <ConnectedLayout className={panelClassName} />
          <ConnectedMetadata className={panelClassName} />
          <ConnectedBlocks className={panelClassName} />
        </div>
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
    toggleLogo: PropTypes.func.isRequired,
    logoIsOn: PropTypes.bool.isRequired,
  },

  // componentWillReceiveProps(newProps) {
  //   console.log('Layout received new props:', newProps);
  // },

  render: function () {
    // console.log('render called. row percs are: ', this.props.rowPercs);
    const sliderStyle = {
      'marginTop': '0px',
      'marginBottom': '10px',
    };
    const colNames = [ 'Left', 'Middle', 'Right' ];
    const Columns = this.props.colPercs.map((cv, idx) =>
      <div key={idx} className="range-field">
        {colNames[idx]}
        <Slider
          name={colNames[idx]}
          min={0}
          max={100}
          value={cv}
          style={sliderStyle}
          onChange={this.props.onSliderChange.bind(this, true, idx)}
        />
      </div>
    );
    const rowNames = [ 'Top', 'Middle', 'Bottom' ];
    const Rows = this.props.rowPercs.map((cv, idx) =>
      <div key={idx} className="range-field">
        {rowNames[idx]}
        <Slider
          name={rowNames[idx]}
          min={0}
          max={100}
          value={cv}
          style={sliderStyle}
          onChange={this.props.onSliderChange.bind(this, false, idx)}
        />
      </div>
    );
    return (
      <div className={this.props.className}>
        <h3>Panel Layout</h3>
        <h4>columns:</h4>
        {Columns}
        <h4>rows:</h4>
        {Rows}
        {/* toggle on / off the logo */}
        <h4>other:</h4>
        <Toggle
          name="master"
          value="master"
          labelPosition="right"
          label="Phandango logo on / off"
          disabled={false}
          defaultToggled={this.props.logoIsOn}
          onToggle={this.props.toggleLogo}
        />
      </div>
    );
  },

});

const ConnectedLayout = connect(
  (state)=>({
    colPercs: state.layout.colPercs,
    rowPercs: state.layout.rowPercs,
    logoIsOn: state.layout.logoIsOn,
  }),
  (dispatch)=>({
    onSliderChange: (col, idx, e, value) =>
      dispatch(layoutChange(col, idx, parseInt(value, 10))),
    toggleLogo: () =>
      dispatch(toggleLogo()),
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
    headerNames: PropTypes.arrayOf(PropTypes.string),
    toggles: PropTypes.arrayOf(PropTypes.bool),
    fileName: PropTypes.string,
    active: PropTypes.bool,
    className: PropTypes.string,
    toggleMeta: PropTypes.func.isRequired,
    toggleMetaHeader: PropTypes.func.isRequired,
    toggleOffAllMetaHeaders: PropTypes.func.isRequired,
  },

  // componentWillReceiveProps(newProps) {
  //   console.log('Metadata received new props:', newProps);
  // },

  render() {
    if ( (!this.props.fileName) || this.props.fileName === 'not loaded') { return false; }
    const allTogglesOff = this.props.toggles.every( function (e) {return e === false;} );
    return (
      <div className={this.props.className}>
        <h3>Metadata</h3>
        <hr/>
        {/* main on-off switch */}
        <Toggle
          name="master"
          value="master"
          labelPosition="right"
          label="Turn off panel"
          disabled={false}
          defaultToggled={this.props.active}
          onToggle={this.props.toggleMeta.bind(this, this.props.active)}
        />
        <hr/>
        <Toggle
          name="master"
          value="master"
          labelPosition="right"
          label="Toggle off all columns"
          disabled={false}
          defaultToggled={allTogglesOff}
          onToggle={this.props.toggleOffAllMetaHeaders}
        />
        <hr/>
        <div className = {this.props.active ? '' : 'hidden'}>
          <h4>Toggle columns:</h4>
          {this.props.headerNames.map((name, idx) =>
            <Toggle
              name={name}
              value={name}
              key={idx}
              labelPosition="right"
              label={name}
              disabled={false}
              defaultToggled={this.props.toggles[idx]}
              onToggle={this.props.toggleMetaHeader.bind(this, this.props.toggles[idx], idx)}
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
    toggleOffAllMetaHeaders: () => {
      dispatch(toggleOffAllMetaHeaders());
    },
  })
)(Metadata);


/*
 * Loaded components container:
 * just a list of what's loaded and the associated filenames
*/
// const DisplayFileName = ({ active, component, file }) => (
//   <p style={ active ? {} : { textDecoration: 'line-through' } }>
//     <strong>{component}:</strong> {file.split('/').slice(-1)[0]}
//   </p>
// );
// DisplayFileName.propTypes =  {
//   active: PropTypes.bool,
//   component: PropTypes.string,
//   file: PropTypes.string,
// };

// const LoadedComponents = (props) => (
//   <div className={props.className}>
//     <h3>Loaded Data:</h3>
//     <hr/>
//     <DisplayFileName component="Phylogeny" file={props.phylogeny} active={props.active.tree} />
//     <DisplayFileName component="Metadata" file={props.metadata} active={props.active.meta} />
//     <DisplayFileName component="Annotation" file={props.annotation} active={props.active.annotation} />
//   </div>
// );
// LoadedComponents.propTypes = {
//   className: PropTypes.string,
//   active: PropTypes.arrayOf(PropTypes.bool).isRequired, // which components are loaded...
//   metadata: PropTypes.string,
//   annotation: PropTypes.string,
//   phylogeny: PropTypes.string,
//   plots: PropTypes.arrayOf(PropTypes.string),
//   blocks: PropTypes.arrayOf(PropTypes.string),
// };

// const ConnectedLoadedComponents = connect(
//   (state)=>({
//     active: state.layout.active,
//     phylogeny: state.phylogeny.fileName,
//     metadata: state.metadata.fileName,
//     annotation: state.annotation.fileName,
//   })
// )(LoadedComponents);


/* ConnectedBlocks component!

*/
const Blocks = (props) => {
  const available = props.dataAvailable;
  if (available.hasOwnProperty('gubbins') && available.hasOwnProperty('bratNextGen')) {
    available.merged = true;
  }
  const keyMap = { gubbins: 'z', gubbinsPerTaxa: 'x', bratNextGen: 'c', merged: 'v' };
  return (
    <div className={props.className}>
      <h3>Block options:</h3>
      <hr/>
      <h4>Data to display:</h4>
      {Object.keys(available).map((dataName, idx) => {
        let newLabel = dataName;
        if (keyMap[dataName]) {
          newLabel = dataName + ' (press ' + keyMap[dataName] + ')'
        }
        return (
          <Toggle
            key={idx}
            labelPosition="right"
            label={newLabel}
            toggled={dataName === props.currentDataType}
            onToggle={props.show.bind(this, dataName)}
          />
        );
      })}
    </div>
  );
};

Blocks.propTypes = {
  className: PropTypes.string,
  dataAvailable: PropTypes.object,
  currentDataType: PropTypes.string,
  show: PropTypes.func,
};

const ConnectedBlocks = connect(
  (state)=>({
    fileNames: state.blocks.fileNames,
    currentDataType: state.blocks.dataType,
    dataAvailable: state.blocks.dataAvailable,
  }),
  (dispatch)=>({
    show: (name) => {
      dispatch(showBlocks(name));
    },
  })
)(Blocks);

