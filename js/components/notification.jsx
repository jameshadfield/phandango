import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';

/*
Whether or not something is displayed depends on this.state.open
which can be mutatied by (1) redux store change (should only turn on) and
(2) onRequestClose (which always sets it to false)
*/
export class NotificationDisplay extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = { open: false };
    this.requestClose = () => {
      this.setState({ open: false });
      this.props.notificationSeen();
    };
  }
  componentWillReceiveProps(props) {
    this.setState({ open: props.open });
  }
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
  }
}

NotificationDisplay.propTypes = {
  title: PropTypes.string,
  message: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
  dialog: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  notificationSeen: PropTypes.func,
  counter: PropTypes.number.isRequired,
};
