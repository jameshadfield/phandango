import React from 'react';
import { connect } from 'react-redux';

@connect((state) => ({ spinner: state.spinner }))
class Spinner extends React.Component {
  render() {
    if (this.props.spinner) {
      return (
        <div className="sk-fading-circle" id="spinner">
          <div className="sk-circle1 sk-circle"></div>
          <div className="sk-circle2 sk-circle"></div>
          <div className="sk-circle3 sk-circle"></div>
          <div className="sk-circle4 sk-circle"></div>
          <div className="sk-circle5 sk-circle"></div>
          <div className="sk-circle6 sk-circle"></div>
          <div className="sk-circle7 sk-circle"></div>
          <div className="sk-circle8 sk-circle"></div>
          <div className="sk-circle9 sk-circle"></div>
          <div className="sk-circle10 sk-circle"></div>
          <div className="sk-circle11 sk-circle"></div>
          <div className="sk-circle12 sk-circle"></div>
        </div>
      );
    }
    return null;
  }
}

export default Spinner;
