import React from 'react';

export const Switch = React.createClass({ displayName: 'settingsSwitch',
  propTypes: {
    id: React.PropTypes.string.isRequired,
    disabled: React.PropTypes.bool.isRequired,
    handleChange: React.PropTypes.func.isRequired,
    isChecked: React.PropTypes.bool.isRequired,
    header: React.PropTypes.string.isRequired,
  },

  render: function () {
    return (
      <div id="mySwitch" key={this.props.id} className="switch">
        <label>
          Off
          <input disabled={this.props.disabled} type="checkbox" defaultChecked={this.props.isChecked} onChange={this.props.handleChange}/>
          <span className="lever"></span>
          On
        </label>
        <div className="horizontalgap">{this.props.header}</div>
      </div>
    );
  },
});
