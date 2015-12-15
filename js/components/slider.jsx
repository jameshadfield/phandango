import React from 'react';

export const Slider = React.createClass({
  propTypes: {
    currentValue: React.PropTypes.number.isRequired,
    newValue: React.PropTypes.func.isRequired,
    name: React.PropTypes.string.isRequired,
  },

  render: function () {
    return (
      <p className="range-field">
        {this.props.name}
        <input type="range" min="0" max="100" value={this.props.currentValue} onChange={this.props.newValue}/>
      </p>
    );
  },
});
