/* eslint-disable max-len */
import React from 'react';
import version from '../version';
import { AnimatedLogo } from '../components/logo';

export const LandingPage = React.createClass({
  propTypes: {
    goToPage: React.PropTypes.func.isRequired,
    browserMessage: React.PropTypes.string
  },

  render() {
    let browserMessage = null;
    if (this.props.browserMessage) {
      browserMessage = (
        <strong>
          Please note, we have not tested phandango on your browser - {this.props.browserMessage}. Let us know if anything is amiss!
        </strong>
      );
    }
    return (
      <div className="center" style={{ paddingTop: '15vh' }}>

        <h2 className="light">
          Interactive visualization of genome phylogenies
        </h2>

        <h3 className="light">
          (formerly known as <a href="https://jameshadfield.github.io/phandango/v02x.html">JScandy</a>)
        </h3>

        <AnimatedLogo w={600} h={200} interval={2000} animate={!!navigator.userAgent.match(/WebKit/i)}/>
        <p/>


        <h2 className="light">
          drop your data on to begin
        </h2>

        {browserMessage}

        <p style={{ color: '#225ea8' }}>
          <a className="pointer" onClick={()=>this.props.goToPage('about')}>About (incl. data formats)</a>
          <br/><br/>
          <a className="pointer" onClick={()=>this.props.goToPage('examples')}>Example Datasets</a>
          <br/><br/>
          <a className="pointer" onClick={()=>this.props.goToPage('help')}>How to use</a>
          <br/><br/>
          <a className="pointer" onClick={()=>window.open('https://github.com/jameshadfield/phandango', '_blank')}>Github (source code)</a>
          <br/><br/>
          <a href="mailto:jh22@sanger.ac.uk">Contact (email)</a>
        </p>
        <br/>
        version {version}
      </div>
    );
  },
});


/* previous attempt to center vertially failed when the screen became smaller than the height!
      <div id="outer">
        <div className="center centeredVertically ">
          ...
        </div>
      </div>
*/
