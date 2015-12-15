import { fileDropped } from '../actions/fileInput';
import { route } from '../actions/general';
import { connect } from 'react-redux';
import { CanvasContainer } from './canvases';
import { Settings } from './settings';
import { Landing } from './landingPage';
import { Spinner } from '../components/spinner';
import React from 'react';

/*
Connect the containers which will be displayed here to redux store / dispatch etc
Note that the MainReactElement cannot itself access store/state as it itself
displays nothing apart from child containers (which need display information)
*/
const ConnectedCanvasContainer = connect((state)=>({
  active: state.layout.active,
  colPercs: state.layout.colPercs,
  rowPercs: state.layout.rowPercs,
}))(CanvasContainer);
const ConnectedSettings = connect()(Settings);


/*
The purposes of the MainReactElement:
* add global listeners
* read the current page (@props) and choose display containers accordingly
*/
export const MainReactElement = React.createClass({ displayName: 'Main_React_Element',
  propTypes: {
    page: React.PropTypes.string.isRequired,
    dispatch: React.PropTypes.func.isRequired,
  },
  componentDidMount: function () {
    document.addEventListener('dragover', (e) => {e.preventDefault();}, false);
    document.addEventListener('drop', this.filesDropped, false);
    document.addEventListener('keyup', this.keyIncoming);
  },
  render: function () {
    let injectedPage;
    switch (this.props.page) {
    case 'settings':
      injectedPage = <ConnectedSettings />;
      break;
    case 'landing':
      injectedPage = <Landing />;
      break;
    case 'loading':
      injectedPage = <Spinner />;
      break;
    default:
      injectedPage = false;
    }

    return (
      <div id="mainDiv" ref={(c) => this.node = c}>
        {injectedPage}
        <ConnectedCanvasContainer />
      </div>
    );
  },

  keyIncoming: function (event) {
    // http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
    if (event.keyCode === 83 || event.charCode === 83) { // 's'
      this.props.dispatch(route('settings'));
    } else if (event.keyCode === 77 || event.charCode === 77) { // 'm'
      this.props.dispatch(route('canvases'));
    }
  },

  filesDropped(e) {
    this.props.dispatch(route('loading'));
    const files = e.dataTransfer.files;
    e.preventDefault();
    for (let i = 0; i < files.length; i++) {
      this.props.dispatch(fileDropped(files[i]));
    }
  },
});

