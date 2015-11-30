var React = require('react');
var Dialog = require('material-ui/lib/dialog'); //eslint-disable-line no-unused-vars
//http://www.material-ui.com/#/components/snackbar
var Snackbar = require('material-ui/lib/snackbar'); //eslint-disable-line no-unused-vars
// var RaisedButton = require('material-ui/lib/raised-button');
var ErrStore = require('../stores/ErrStore.js');
var ErrStruct = require('../structs/errStruct.js');

var ErrDiv = React.createClass({displayName: 'displayName',

  componentDidMount: function () {
    ErrStore.addChangeListener(this._getError);
  },

  _getError: function () {
    var errObj = ErrStore.getErr();
    if (errObj) {
      this.setState({errObj: errObj});
      this.refs.errorDisplay.setState({open: true});
    }
  },

  getInitialState: function () {
    return ({errObj: new ErrStruct()});
  },

  _handleTouchTap() {
    this.refs.errorDialog.show();
  },

  render: function () {
    var standardActions = []; //[{text: 'standard text'}];
    // var title = <h3><font color="orange">WARNING</font> {this.state.errObj.title}</h3>;
    var mui; // the react code from material UI
    if (this.state.errObj.isDialog) {
      mui =
        <Dialog
          title={this.state.errObj.title}
          actions={standardActions}
          open={this.state.showDialogStandardActions}
          onRequestClose={this._getError}
          ref='errorDisplay'>
          {this.state.errObj.message}
        </Dialog>;
    } else {
      mui =
        <Snackbar
          title={this.state.errObj.title}
          message={this.state.errObj.title}
          autoHideDuration={2000}
          ref='errorDisplay'>
          {this.state.errObj.title}
        </Snackbar>;
    }
    return (
      <g>{mui}</g>
    );
  }
});

module.exports = ErrDiv;

// <RaisedButton label="Super Secret Password" primary={true} onTouchTap={this._handleTouchTap} />
// <Dialog
//   title="Dialog With Standard Actions"
//   actions={standardActions}
//   actionFocus="submit"
//   open={this.state.showDialogStandardActions}
//   onRequestClose={this._handleRequestClose}>
//   The actions in this window are created from the json that's passed in.
// </Dialog>
