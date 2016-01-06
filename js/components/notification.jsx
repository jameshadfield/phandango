import React, { PropTypes } from 'react';
import Dialog from 'material-ui/lib/dialog';
import Snackbar from 'material-ui/lib/snackbar';

/*
Whether or not something is displayed depends on this.state.open
which can be mutatied by (1) redux store change (should only turn on) and
(2) onRequestClose (which always sets it to false)
*/

export const NotificationDisplay = React.createClass({
  propTypes: {
    title: PropTypes.string,
    message: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
    dialog: PropTypes.bool.isRequired,
    open: PropTypes.bool.isRequired,
    notificationSeen: PropTypes.func,
    counter: PropTypes.number.isRequired,
  },

  getInitialState() {
    return ({ open: false });
  },

  componentWillReceiveProps(props) {
    this.setState({ open: props.open });
  },

  render() {
    let mui;
    if (this.props.dialog) {
      mui = (
        <Dialog
          title={this.props.title}
          ref="errorDisplay"
          onRequestClose={this.requestClose}
          open={this.state.open}>
          {this.props.message}
        </Dialog>
      );
    } else {
      mui = (
        <Snackbar
          message={this.props.title}
          ref="errorDisplay"
          onRequestClose={this.requestClose}
          autoHideDuration={2000}
          open={this.state.open}
        />
      );
    }
    return (
      <g>
        {mui}
      </g>
    );
  },

  requestClose() {
    this.setState({ open: false });
    this.props.notificationSeen();
  },

});
