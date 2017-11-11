import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  layoutPercentChange,
  turnOffCanvas,
  turnOnCanvas,
  toggleMetadataColumn,
  toggleAllMetaColumns,
  clearMetadata,
  clearAllData,
  clearTree,
  clearAnnotationData,
  clearBlockData,
  clearPlotData,
  showBlocks,
  toggleLogo,
} from '../actions/general';
// import { route } from '../actions/general';
import Slider from 'material-ui/Slider';
import Toggle from 'material-ui/Toggle';
import FlatButton from 'material-ui/FlatButton';

/* icons */
import Clear from 'material-ui/svg-icons/content/clear';
import Remove from 'material-ui/svg-icons/content/remove';
import Add from 'material-ui/svg-icons/content/add';

/*
 * Settings: Main Settings Container
 * is almose a dummy components which renders connected containers
 * @props {Function} dispatch - injected by connect
*/

@connect((state) => ({ showSettings: state.misc.showSettings }))
export class Settings extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    showSettings: PropTypes.bool.isRequired,
  }
  constructor(...args) {
    super(...args);
  }
  componentDidMount() {
    // modal-like "click to close"
    // this.node.addEventListener('click', (e) => {
    //   // react id of div: this.node._reactInternalComponent._rootNodeID
    //   // react id of where click was fired: e.target.attributes[1].nodeValue
    //   if (e.target.attributes[1].nodeValue === this.node._reactInternalComponent._rootNodeID) {
    //     this.props.dispatch(route('canvases'));
    //   }
    // }, false);
  }

  render() {
    if (!this.props.showSettings) {
      return null;
    }
    // const panelClassName = 'settings-col';
    const panelClassName = 'col-xs-3 bgwhite border noOverflow';
    // <ConnectedLoadedComponents className={panelClassName} />
    return (
      <div className="fullpage padding10 content" style={{ zIndex: 1000 }} ref={(c) => this.node = c} key="myKey">
        <div className="row" >
          <ConnectedLayout className={panelClassName} />
          <ConnectedMetadata className={panelClassName} />
          <ConnectedBlocks className={panelClassName} />
          <ConnectedLoadedComponents className={panelClassName} />
        </div>
      </div>
    );
  }
}

/*
 * Layout container:
 * a connected component
 * sets up the sliders controlling column and row percentages
 * uses the (dumb) component 'slider.jsx' to display the actual slider
*/

export class Layout extends React.Component {
  constructor(...args) {
    super(...args);
  }
  render() {
    // console.log('render called. row percs are: ', this.props.rowPercs);
    const sliderStyle = {
      'marginTop': '-20px',
      'marginBottom': '-40px',
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
        <hr/>
        <FlatButton
          label="Clear all data"
          labelPosition="after"
          icon={<Clear />}
          onClick={this.props.clearAllData}
        />
        <hr/>
        <FlatButton
          label="Clear tree"
          labelPosition="after"
          icon={<Clear />}
          onClick={this.props.clearTree.bind(this)}
        />
        <hr/>
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
        <p/>
      </div>
    );
  }
}

Layout.propTypes = {
  colPercs: PropTypes.arrayOf(PropTypes.number).isRequired,
  rowPercs: PropTypes.arrayOf(PropTypes.number).isRequired,
  onSliderChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  toggleLogo: PropTypes.func.isRequired,
  logoIsOn: PropTypes.bool.isRequired,
  clearAllData: PropTypes.func.isRequired,
  clearTree: PropTypes.func.isRequired,
};

const ConnectedLayout = connect(
  (state)=>({
    colPercs: state.layout.colPercs,
    rowPercs: state.layout.rowPercs,
    logoIsOn: state.layout.logoIsOn,
  }),
  (dispatch)=>({
    // onSliderChange: (col, idx, e, value) =>
    //   dispatch(layoutChange(col, idx, parseInt(value, 10))),
    onSliderChange: (col, idx, e, value) =>
      dispatch(layoutPercentChange(col, idx, parseInt(value, 10))),
    toggleLogo: () =>
      dispatch(toggleLogo()),
    clearAllData: () => {
      dispatch(clearAllData(true));
    },
    clearTree: () => {
      dispatch(clearTree());
    },
  })
)(Layout);


/*
 * Metadata container:
 * sets up the sliders controlling column and row percentages
 * uses the component 'switch.jsx' to display the toggles
 * controlls the callbacks from the switches
*/
export class Metadata extends React.Component {
  constructor(...args) {
    super(...args);
  }
  /* deleted from render: main on-off switch
        <Toggle
          name="master"
          value="master"
          labelPosition="right"
          label="Turn off panel"
          disabled={false}
          defaultToggled={this.props.active}
          onToggle={this.props.toggleMeta.bind(this, this.props.active)}
        />
  */
  render() {
    if ( (!this.props.fileName) || this.props.fileName === 'not loaded') { return false; }
    return (
      <div className={this.props.className}>
        <h3>Metadata</h3>
        <hr/>
        <FlatButton
          label="Clear metadata"
          labelPosition="after"
          icon={<Clear />}
          onClick={this.props.clearMetadata.bind(this)}
        />
        <hr/>
        <FlatButton
          label="Turn off all columns"
          labelPosition="after"
          icon={<Remove />}
          onClick={this.props.toggleAllMetaColumns.bind(this, false)}
        />
        <FlatButton
          label="Turn on all columns"
          labelPosition="after"
          icon={<Add />}
          onClick={this.props.toggleAllMetaColumns.bind(this, true)}
        />
        <hr/>
        <div >
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
  }
}

Metadata.propTypes = {
  headerNames: PropTypes.arrayOf(PropTypes.string),
  toggles: PropTypes.arrayOf(PropTypes.bool),
  fileName: PropTypes.string,
  active: PropTypes.bool,
  className: PropTypes.string,
  // toggleMeta: PropTypes.func.isRequired,
  toggleMetaHeader: PropTypes.func.isRequired,
  toggleAllMetaColumns: PropTypes.func.isRequired,
  clearMetadata: PropTypes.func.isRequired,
};

const ConnectedMetadata = connect(
  (state)=>({
    headerNames: state.metadata.headerNames,
    toggles: state.metadata.toggles,
    fileName: state.metadata.fileName,
    active: state.layout.active.meta,
  }),
  (dispatch)=>({
    // toggleMeta: (currentValue) => {
    //   currentValue ? dispatch(turnOffCanvas('meta')) : dispatch(turnOnCanvas('meta'));
    // },
    toggleMetaHeader: (currentValue, headerIdx) => {
      dispatch(toggleMetadataColumn(headerIdx, !currentValue));
    },
    toggleAllMetaColumns: (newBool) => {
      dispatch(toggleAllMetaColumns(newBool));
    },
    clearMetadata: () => {
      dispatch(clearMetadata());
    },
  })
)(Metadata);


/*
 * Loaded components container:
 * just a list of what's loaded and the associated filenames
*/
const DisplayFileName = ({ active, component, file }) => (
  <p style={ active ? {} : { textDecoration: 'line-through' } }>
    <strong>{component}:</strong> {file.split('/').slice(-1)[0]}
  </p>
);
DisplayFileName.propTypes =  {
  active: PropTypes.bool,
  component: PropTypes.string,
  file: PropTypes.string,
};

const LoadedComponents = (props) => (
  <div className={props.className}>
    <h3>Loaded Data:</h3>
    <hr/>
    <DisplayFileName component="Phylogeny" file={props.phylogeny} active={props.active.tree} />
    <DisplayFileName component="Metadata" file={props.metadata} active={props.active.meta} />
    <DisplayFileName component="Annotation" file={props.annotation} active={props.active.annotation} />
    {Object.keys(props.blocks).map((dataName, idx) => {
      return (
        <DisplayFileName component={dataName} key={idx} file={props.blocks[dataName]} active={true} />
      );
    })}
  </div>
);
LoadedComponents.propTypes = {
  className: PropTypes.string,
  active: PropTypes.object.isRequired, // which components are loaded...
  metadata: PropTypes.string,
  annotation: PropTypes.string,
  phylogeny: PropTypes.string,
  plots: PropTypes.arrayOf(PropTypes.string),
  blocks: PropTypes.object,
};

const ConnectedLoadedComponents = connect(
  (state)=>({
    active: state.layout.active,
    phylogeny: state.phylogeny.fileName,
    metadata: state.metadata.fileName,
    annotation: state.annotation.fileName,
    blocks: state.blocks.fileNames,
  })
)(LoadedComponents);


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
      <FlatButton
        label="Clear annotation data"
        labelPosition="after"
        icon={<Clear />}
        onClick={props.clearAnnotationData.bind(this)}
      />
      <hr/>
      <FlatButton
        label="Clear block data"
        labelPosition="after"
        icon={<Clear />}
        onClick={props.clearBlockData.bind(this)}
      />
      <hr/>
      <FlatButton
        label="Clear plot data"
        labelPosition="after"
        icon={<Clear />}
        onClick={props.clearPlotData.bind(this)}
      />
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
  clearAnnotationData: PropTypes.func,
  clearBlockData: PropTypes.func,
  clearPlotData: PropTypes.func,
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
    clearAnnotationData: () => {
      dispatch(clearAnnotationData());
    },
    clearBlockData: () => {
      dispatch(clearBlockData());
    },
    clearPlotData: () => {
      dispatch(clearPlotData());
    },
  })
)(Blocks);
