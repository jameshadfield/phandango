import React from 'react';
import CircularProgress from 'material-ui/lib/circular-progress';

export const Spinner = React.createClass({
  render: function () {
    console.log('spinning');
    return (
      <div className="fullpage center-align" id="spinner">
        <CircularProgress mode="indeterminate" color={"red"} size={1.5} />
      </div>
    );
  },
});
