const React = require('react');
const Dialog = require('material-ui/lib/dialog');
const Snackbar = require('material-ui/lib/snackbar'); // http://www.material-ui.com/#/components/snackbar
const ErrStore = require('../stores/ErrStore.js');
const ErrStruct = require('../structs/errStruct.js');

const ErrDiv = React.createClass({ displayName: 'displayName',

  componentDidMount: function () {
    ErrStore.addChangeListener(this._getError);
  },

  getInitialState: function () {
    return ({ errObj: new ErrStruct() });
  },

  render: function () {
    const standardActions = []; // [{text: 'standard text'}];
    // var title = <h3><font color="orange">WARNING</font> {this.state.errObj.title}</h3>;
    let mui; // the react code from material UI
    // TO DO
    // NOT WORKING IN WEBPACK FOR SOME UNKNOWN REASON
    // CHANGE AWAY FROM MATERIAL UI ?
    // if (this.state.errObj.isDialog) {
    //   mui = (
    //     <Dialog
    //       title={this.state.errObj.title}
    //       actions={standardActions}
    //       open={this.state.showDialogStandardActions}
    //       onRequestClose={this._getError}
    //       ref="errorDisplay">
    //       {this.state.errObj.message}
    //     </Dialog>
    //   );
    // } else {
    //   mui = (
    //     <Snackbar
    //       title={this.state.errObj.title}
    //       message={this.state.errObj.title}
    //       autoHideDuration={2000}
    //       ref="errorDisplay">
    //       {this.state.errObj.title}
    //     </Snackbar>
    //   );
    // }
    mui = (
      <Snackbar
        title={this.state.errObj.title}
        message={this.state.errObj.title || ''}
        autoHideDuration={2000}
        ref="errorDisplay">
        {this.state.errObj.title}
      </Snackbar>
    );
    return (
      <g>{mui}</g>
    );
  },

  _handleTouchTap() {
    this.refs.errorDialog.show();
  },

  _getError: function () {
    const errObj = ErrStore.getErr();
    if (errObj) {
      this.setState({ errObj: errObj });
      this.refs.errorDisplay.setState({ open: true });
    }
  },

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
